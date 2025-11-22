import { DurableObject } from 'cloudflare:workers';
import type {
	ClientMessage,
	ServerMessage,
	SessionIdMessage,
	MatchedMessage,
	SearchingMessage,
	ServerChatMessage,
	PartnerDisconnectedMessage,
	PongMessage,
	ChatEndedMessage,
} from './types';

/**
 * User connection information
 */
interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean; // Track authentication status
}

class Queue {
	private storage: Record<number, string>;
	private head: number;
	private tail: number;
	private set: Set<string>;

	constructor() {
		this.storage = {};
		this.head = 0;
		this.tail = 0;
		this.set = new Set(); // track items
	}

	enqueue(value: string): boolean {
		if (this.set.has(value)) return false; // already exists

		this.storage[this.tail] = value;
		this.tail++;
		this.set.add(value);
		return true;
	}

	dequeue(): string | null {
		if (this.isEmpty()) return null;

		const value = this.storage[this.head];
		delete this.storage[this.head];
		this.head++;
		this.set.delete(value); // remove from lookup
		return value;
	}

	contains(value: string): boolean {
		return this.set.has(value);
	}

	isEmpty(): boolean {
		return this.tail === this.head;
	}

	/**
	 * Get all items in the queue as an array (for persistence)
	 */
	toArray(): string[] {
		const result: string[] = [];
		for (let i = this.head; i < this.tail; i++) {
			result.push(this.storage[i]);
		}
		return result;
	}
}

/**
 * ChatQueue Durable Object
 * Manages the queue of available users, matches them, and routes messages
 */
export class ChatQueue extends DurableObject<Env> {
	// Map of sessionId -> UserConnection
	private connections: Map<string, UserConnection> = new Map();
	// Queue of available users (sessionIds)
	private availableQueue: Queue = new Queue();
	// Flag to track if state has been initialized
	private stateInitialized: boolean = false;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * Initialize state from storage and active WebSockets
	 * This is called when the Durable Object wakes up from hibernation
	 */
	private async initializeState(): Promise<void> {
		if (this.stateInitialized) {
			return;
		}

		// Rebuild connections map from active WebSockets
		const activeWebSockets = this.ctx.getWebSockets();
		console.log(`Initializing state with ${activeWebSockets.length} active WebSockets`);

		for (const ws of activeWebSockets) {
			const sessionId = ws.deserializeAttachment() as string | null;
			if (sessionId) {
				// Rebuild connection entry (partner will be restored from storage)
				this.connections.set(sessionId, {
					sessionId,
					ws,
					currentPartnerId: null, // Will be restored from storage
					isAuthenticated: false, // Will need to re-authenticate
				});
				console.log(`Restored connection for session: ${sessionId}`);
			}
		}

		// Load authenticated sessions from storage
		try {
			const authenticatedSessions = await this.ctx.storage.get<string[]>('authenticatedSessions');
			if (authenticatedSessions && Array.isArray(authenticatedSessions)) {
				for (const sessionId of authenticatedSessions) {
					const connection = this.connections.get(sessionId);
					if (connection) {
						connection.isAuthenticated = true;
						console.log(`Restored auth for session: ${sessionId}`);
					}
				}
			}
		} catch (error) {
			console.error('Error loading authenticated sessions:', error);
		}

		// Load partner relationships from storage
		try {
			const storedPartners = await this.ctx.storage.get<Record<string, string>>('partnerRelationships');
			if (storedPartners && typeof storedPartners === 'object') {
				// Restore partner relationships
				for (const [sessionId, partnerId] of Object.entries(storedPartners)) {
					const connection = this.connections.get(sessionId);
					const partnerConnection = this.connections.get(partnerId);

					// Only restore if both connections still exist
					if (connection && partnerConnection) {
						connection.currentPartnerId = partnerId;
						partnerConnection.currentPartnerId = sessionId;
						console.log(`Restored partnership: ${sessionId} <-> ${partnerId}`);
					}
				}
			}
		} catch (error) {
			console.error('Error loading partner relationships from storage:', error);
		}

		// Load queue from storage if it exists
		try {
			const storedQueue = await this.ctx.storage.get<string[]>('availableQueue');
			if (storedQueue && Array.isArray(storedQueue)) {
				// Rebuild queue from storage
				for (const sessionId of storedQueue) {
					// Only add if the connection still exists and is not currently matched
					const connection = this.connections.get(sessionId);
					if (connection && !connection.currentPartnerId) {
						this.availableQueue.enqueue(sessionId);
					}
				}
				console.log(`Restored queue with ${storedQueue.length} items`);
			}
		} catch (error) {
			console.error('Error loading queue from storage:', error);
		}

		this.stateInitialized = true;
	}

	/**
	 * Handle WebSocket upgrade requests
	 */
	async fetch(request: Request): Promise<Response> {
		// Initialize state if needed (handles wake-up from hibernation)
		await this.initializeState();

		// Check request method (WebSocket upgrades should be GET)
		if (request.method !== 'GET') {
			return new Response(`Method ${request.method} not allowed. Use GET for WebSocket upgrade.`, {
				status: 405,
				headers: {
					Allow: 'GET',
				},
			});
		}

		// Check if this is a WebSocket upgrade request
		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader !== 'websocket') {
			return new Response('Expected WebSocket upgrade request. Missing "Upgrade: websocket" header.', {
				status: 426,
				headers: {
					Upgrade: 'websocket',
				},
			});
		}

		// Create WebSocket pair
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);

		// Generate a unique Session ID (UUID v4)
		const connectionId = crypto.randomUUID();

		// Attach the connectionId to the server WebSocket (for Durable Object-side)
		server.serializeAttachment(connectionId);

		// Log the new WebSocket connection
		console.log(`New WebSocket connection established. Session ID: ${connectionId}`);

		// Accept the WebSocket connection in the Durable Object
		this.ctx.acceptWebSocket(server);

		this.connections.set(connectionId, {
			sessionId: connectionId,
			ws: server,
			currentPartnerId: null,
			isAuthenticated: false, // Starts unauthenticated
		});

		// Return response with WebSocket
		return new Response(null, {
			status: 101,
			webSocket: client,
			headers: {
				Upgrade: 'websocket',
			},
		});
	}

	/**
	 * Handle WebSocket messages
	 */
	async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
		// Ensure state is initialized
		await this.initializeState();

		try {
			// Parse message
			const text = typeof message === 'string' ? message : new TextDecoder().decode(message);
			const clientMsg: ClientMessage = JSON.parse(text);

			const sessionId = ws.deserializeAttachment() as string;
			console.log('WebSocket message received:', clientMsg, 'Session ID:', sessionId);

			// Ensure connection exists in our map
			if (!this.connections.has(sessionId)) {
				this.connections.set(sessionId, {
					sessionId,
					ws,
					currentPartnerId: null,
					isAuthenticated: false,
				});
			} else {
				// Update WebSocket reference in case it changed
				this.connections.get(sessionId)!.ws = ws;
			}

			const connection = this.connections.get(sessionId)!;

			// Handle authentication first
			if (clientMsg.type === 'auth') {
				await this.handleAuth(ws, clientMsg.apiKey);
				return;
			}

			// Require authentication for all other messages
			if (!connection.isAuthenticated) {
				console.log(`Unauthenticated request from ${sessionId}`);
				const errorMsg: ServerMessage = {
					type: 'auth_error',
					error: 'Not authenticated',
				};
				ws.send(JSON.stringify(errorMsg));
				ws.close(4001, 'Not authenticated');
				return;
			}

			// Handle different message types
			switch (clientMsg.type) {
				case 'search':
					await this.handleSearch(ws);
					break;
				case 'message':
					await this.handleMessage(ws, clientMsg.text, clientMsg.imageUrl);
					break;
				case 'end_chat':
					await this.handleEndChat(ws);
					break;
				case 'ping':
					await this.handlePing(ws);
					break;
				default:
					console.warn('Unknown message type:', clientMsg);
			}
		} catch (error) {
			console.error('Error handling WebSocket message:', error);
			// Send error response if possible
			try {
				const errorMsg: ServerMessage = {
					type: 'chat_ended',
				};
				ws.send(JSON.stringify(errorMsg));
			} catch (e) {
				// Connection might be closed
			}
		}
	}

	/**
	 * Handle WebSocket close
	 */
	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
		console.log(`WebSocket closed: code=${code}, reason=${reason}, wasClean=${wasClean}`);

		// Note: When client closes abruptly, the WebSocket is already closing/closed
		// so we can't send a close frame back. The 1006 error on client side is expected.
		// The server handles the cleanup correctly regardless.

		const sessionId = ws.deserializeAttachment() as string;
		if (sessionId) {
			console.log(`Disconnecting session: ${sessionId}`);
			await this.handleDisconnect(sessionId);
		} else {
			// If sessionId is not set, try to find the connection by WebSocket
			// This handles cases where disconnect happens before first message
			console.log('SessionId not found, searching by WebSocket reference');
			for (const [id, conn] of this.connections.entries()) {
				if (conn.ws === ws) {
					console.log(`Found connection by WebSocket reference: ${id}`);
					await this.handleDisconnect(id);
					break;
				}
			}
		}
	}

	/**
	 * Handle WebSocket error
	 */
	async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
		console.error('WebSocket error:', error);
		const sessionId = ws.deserializeAttachment() as string;
		if (sessionId) {
			await this.handleDisconnect(sessionId);
		} else {
			// If sessionId is not set, try to find the connection by WebSocket
			for (const [id, conn] of this.connections.entries()) {
				if (conn.ws === ws) {
					await this.handleDisconnect(id);
					break;
				}
			}
		}
	}

	/**
	 * Persist authenticated sessions to storage
	 */
	private async persistAuthState(): Promise<void> {
		const authenticatedSessions = Array.from(this.connections.entries())
			.filter(([_, conn]) => conn.isAuthenticated)
			.map(([sessionId, _]) => sessionId);

		await this.ctx.storage.put('authenticatedSessions', authenticatedSessions);
		console.log(`Persisted ${authenticatedSessions.length} authenticated sessions`);
	}

	/**
	 * Validate API key
	 */
	private validateApiKey(apiKey: string | undefined): boolean {
		if (!apiKey) {
			return false;
		}

		// Check against environment variables
		const validKeys = [this.env.WEB_API_KEY, this.env.MOBILE_API_KEY].filter(Boolean);

		return validKeys.includes(apiKey);
	}

	/**
	 * Handle authentication
	 */
	private async handleAuth(ws: WebSocket, apiKey: string | undefined): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;
		const connection = this.connections.get(sessionId);

		if (!connection) {
			console.log(`Connection not found for session: ${sessionId}`);
			ws.close(4000, 'Connection not found');
			return;
		}

		if (this.validateApiKey(apiKey)) {
			// Authentication successful
			connection.isAuthenticated = true;
			await this.persistAuthState(); // Persist auth state
			const successMsg: ServerMessage = {
				type: 'auth_success',
			};
			ws.send(JSON.stringify(successMsg));
			console.log(`✅ Authentication successful for session: ${sessionId}`);
		} else {
			// Authentication failed
			const errorMsg: ServerMessage = {
				type: 'auth_error',
				error: 'Invalid API key',
			};
			ws.send(JSON.stringify(errorMsg));
			ws.close(4001, 'Authentication failed');
			console.log(`❌ Authentication failed for session: ${sessionId}`);
		}
	}

	/**
	 * Handle search request (used for both "start" and "move next")
	 */
	private async handleSearch(ws: WebSocket): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;

		const connection = this.connections.get(sessionId);

		// If user has a current partner, release them
		if (connection && connection.currentPartnerId) {
			await this.releasePartner(sessionId, connection.currentPartnerId);
		}

		// add a delay of 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Try to find an available user
		console.log(`Queue (Handle Search Start): ${this.availableQueue.isEmpty() ? '0' : '1'}`);

		let availableUser: string | null = null;

		while (true) {
			availableUser = this.availableQueue.dequeue();
			await this.persistQueue();
			if (availableUser === null) {
				break;
			} else if (!this.connections.get(availableUser)) {
				continue;
			} else {
				break;
			}
		}

		console.log(`Queue (Handle Search End): ${this.availableQueue.isEmpty() ? '0' : '1'}`);

		if (availableUser === null) {
			// No available users, add to queue
			await this.addToQueue(ws);
		} else {
			// Match found!
			console.log('Match found!');
			await this.matchUsers(sessionId, availableUser as string);
		}
	}

	/**
	 * Handle chat message (supports text and images/GIFs/stickers)
	 */
	private async handleMessage(ws: WebSocket, text?: string, imageUrl?: string): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;

		const connection = this.connections.get(sessionId);
		if (!connection || !connection.currentPartnerId) {
			ws.send(JSON.stringify({ type: 'partner_disconnected' }));
			return; // Not connected to anyone
		}

		const partnerConnection = this.connections.get(connection.currentPartnerId);
		if (!partnerConnection) {
			// Partner disconnected, clean up
			connection.currentPartnerId = null;
			ws.send(JSON.stringify({ type: 'partner_disconnected' }));
			return;
		}

		// Validate that we have either text or imageUrl
		if (!text && !imageUrl) {
			ws.send(JSON.stringify({ type: 'error', message: 'Message must have text or imageUrl' }));
			return;
		}

		// Send message to partner
		const msg: ServerChatMessage = {
			type: 'message',
			text: text,
			imageUrl: imageUrl,
			from: sessionId,
		};

		try {
			partnerConnection.ws.send(JSON.stringify(msg));
		} catch (error) {
			console.error('Error sending message to partner:', error);
			// Partner connection is broken, clean up
			await this.handleDisconnect(connection.currentPartnerId);
			connection.currentPartnerId = null;
		}
	}

	/**
	 * Handle end chat request
	 */
	private async handleEndChat(ws: WebSocket): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;

		const connection = this.connections.get(sessionId);
		if (connection && connection.currentPartnerId) {
			// Release partner (this will also update storage)
			await this.releasePartner(sessionId, connection.currentPartnerId);
		}

		// Remove from connections and queue
		this.connections.delete(sessionId);

		// Update partner relationships in storage
		await this.persistPartnerRelationships();

		// Send confirmation
		const msg: ChatEndedMessage = {
			type: 'chat_ended',
		};

		try {
			ws.send(JSON.stringify(msg));
			// Close the WebSocket with a proper close frame
			ws.close(1000, 'Chat ended');
		} catch (error) {
			console.error('Error sending end chat message or closing WebSocket:', error);
			// If send fails, still try to close
			try {
				ws.close(1000, 'Chat ended');
			} catch (e) {
				// WebSocket might already be closed
			}
		}
	}

	/**
	 * Handle ping request
	 */
	private async handlePing(ws: WebSocket): Promise<void> {
		const msg: PongMessage = {
			type: 'pong',
		};
		ws.send(JSON.stringify(msg));
	}

	/**
	 * Match two users together
	 */
	private async matchUsers(sessionId1: string, sessionId2: string): Promise<void> {
		const conn1 = this.connections.get(sessionId1);
		const conn2 = this.connections.get(sessionId2);

		if (!conn1 || !conn2) {
			return;
		}

		// Set partners
		conn1.currentPartnerId = sessionId2;
		conn2.currentPartnerId = sessionId1;

		// Persist partner relationships to storage
		await this.persistPartnerRelationships();

		// Send matched messages
		const msg1: MatchedMessage = {
			type: 'matched',
			partnerId: sessionId2,
		};
		const msg2: MatchedMessage = {
			type: 'matched',
			partnerId: sessionId1,
		};

		conn1.ws.send(JSON.stringify(msg1));
		conn2.ws.send(JSON.stringify(msg2));
	}

	/**
	 * Release a partner (put them back in queue)
	 */
	private async releasePartner(sessionId: string, partnerId: string): Promise<void> {
		const partnerConnection = this.connections.get(partnerId);
		if (partnerConnection) {
			partnerConnection.currentPartnerId = null;

			// Notify partner
			const msg: PartnerDisconnectedMessage = {
				type: 'partner_disconnected',
			};
			try {
				partnerConnection.ws.send(JSON.stringify(msg));
			} catch (error) {
				console.error('Error notifying partner:', error);
			}

			// Put partner back in queue if they're still connected
			if (!this.availableQueue.contains(partnerId)) {
				this.availableQueue.enqueue(partnerId);
				await this.persistQueue();
			}
		}

		// Clear current partner from requester
		const connection = this.connections.get(sessionId);
		if (connection) {
			connection.currentPartnerId = null;
		}

		// Update partner relationships in storage
		await this.persistPartnerRelationships();
	}

	/**
	 * Add user to queue
	 */
	private async addToQueue(ws: WebSocket): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;

		// Add to queue if not already there
		if (!this.availableQueue.contains(sessionId)) {
			this.availableQueue.enqueue(sessionId);
			// Persist queue to storage
			await this.persistQueue();
		}

		console.log(`Queue (Add to Queue): ${this.availableQueue.isEmpty() ? '0' : '1'}`);

		// Send searching message
		const msg: SearchingMessage = {
			type: 'searching',
		};
		ws.send(JSON.stringify(msg));
	}

	/**
	 * Persist queue state to storage
	 */
	private async persistQueue(): Promise<void> {
		// Get all items from the queue
		const queueArray = this.availableQueue.toArray();

		try {
			await this.ctx.storage.put('availableQueue', queueArray);
			console.log(`Persisted queue with ${queueArray.length} items`);
		} catch (error) {
			console.error('Error persisting queue to storage:', error);
		}
	}

	/**
	 * Persist partner relationships to storage
	 */
	private async persistPartnerRelationships(): Promise<void> {
		const relationships: Record<string, string> = {};

		// Build relationships map from connections
		for (const [sessionId, connection] of this.connections.entries()) {
			if (connection.currentPartnerId) {
				relationships[sessionId] = connection.currentPartnerId;
			}
		}

		try {
			await this.ctx.storage.put('partnerRelationships', relationships);
			console.log(`Persisted ${Object.keys(relationships).length} partner relationships`);
		} catch (error) {
			console.error('Error persisting partner relationships to storage:', error);
		}
	}

	/**
	 * Handle user disconnect
	 */
	private async handleDisconnect(sessionId: string): Promise<void> {
		console.log(`Handling disconnect for session: ${sessionId}`);
		const connection = this.connections.get(sessionId);
		if (connection && connection.currentPartnerId) {
			console.log(`User ${sessionId} had partner ${connection.currentPartnerId}, releasing...`);
			// Notify partner
			await this.releasePartner(sessionId, connection.currentPartnerId);
		}

		// Remove from connections and queue
		this.connections.delete(sessionId);

		// Update authentication state in storage
		await this.persistAuthState();

		// Update partner relationships in storage (remove this user's relationship)
		await this.persistPartnerRelationships();

		console.log(`Session ${sessionId} removed from connections`);
	}
}
