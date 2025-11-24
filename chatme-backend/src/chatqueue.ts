import { DurableObject } from 'cloudflare:workers';
import type {
	ClientMessage,
	ServerMessage,
	SearchingMessage,
	PongMessage,
	ChatEndedMessage,
} from './types';

// Services
import { AuthenticationService } from './services/AuthenticationService';
import { QueueManagementService } from './services/QueueManagementService';
import { PartnerMatchingService } from './services/PartnerMatchingService';
import { MessageRoutingService } from './services/MessageRoutingService';

// Utilities
import { getSessionId } from './utils/connectionUtils';
import { sendMessage, sendAndClose } from './utils/messageUtils';

/**
 * User connection information
 */
interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean;
}

/**
 * ChatQueue Durable Object
 * Orchestrates user matching and message routing using modular services
 */
export class ChatQueue extends DurableObject<Env> {
	// Core state
	private connections: Map<string, UserConnection> = new Map();
	private stateInitialized: boolean = false;

	// Services
	private authService: AuthenticationService;
	private queueService: QueueManagementService;
	private matchingService: PartnerMatchingService;
	private routingService: MessageRoutingService;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		// Initialize services
		this.authService = new AuthenticationService(this.connections, this.ctx.storage, this.env);
		this.queueService = new QueueManagementService(this.ctx.storage);
		this.matchingService = new PartnerMatchingService(this.connections, this.ctx.storage);
		this.routingService = new MessageRoutingService(this.connections);
	}

	/**
	 * Initialize state from storage and active WebSockets
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
				this.connections.set(sessionId, {
					sessionId,
					ws,
					currentPartnerId: null,
					isAuthenticated: false,
				});
				console.log(`Restored connection for session: ${sessionId}`);
			}
		}

		// Restore state from storage using services
		await this.authService.restoreAuthState();
		await this.matchingService.restorePartnerRelationships();
		await this.queueService.restore(this.connections);

		this.stateInitialized = true;
	}

	/**
	 * Handle WebSocket upgrade requests
	 */
	async fetch(request: Request): Promise<Response> {
		await this.initializeState();

		if (request.method !== 'GET') {
			return new Response(`Method ${request.method} not allowed. Use GET for WebSocket upgrade.`, {
				status: 405,
				headers: { Allow: 'GET' },
			});
		}

		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader !== 'websocket') {
			return new Response('Expected WebSocket upgrade request. Missing "Upgrade: websocket" header.', {
				status: 426,
				headers: { Upgrade: 'websocket' },
			});
		}

		// Create WebSocket pair
		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);

		// Generate unique session ID
		const connectionId = crypto.randomUUID();
		server.serializeAttachment(connectionId);

		console.log(`New WebSocket connection established. Session ID: ${connectionId}`);

		this.ctx.acceptWebSocket(server);

		this.connections.set(connectionId, {
			sessionId: connectionId,
			ws: server,
			currentPartnerId: null,
			isAuthenticated: false,
		});

		return new Response(null, {
			status: 101,
			webSocket: client,
			headers: { Upgrade: 'websocket' },
		});
	}

	/**
	 * Handle WebSocket messages
	 */
	async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
		await this.initializeState();

		try {
			const text = typeof message === 'string' ? message : new TextDecoder().decode(message);
			const clientMsg: ClientMessage = JSON.parse(text);
			const sessionId = getSessionId(ws);

			console.log('WebSocket message received:', clientMsg, 'Session ID:', sessionId);

			// Ensure connection exists
			if (!this.connections.has(sessionId)) {
				this.connections.set(sessionId, {
					sessionId,
					ws,
					currentPartnerId: null,
					isAuthenticated: false,
				});
			} else {
				this.connections.get(sessionId)!.ws = ws;
			}

			const connection = this.connections.get(sessionId)!;

			// Handle authentication
			if (clientMsg.type === 'auth') {
				await this.authService.handleAuth(ws, clientMsg.apiKey);
				return;
			}

			// Require authentication for all other messages
			if (!connection.isAuthenticated) {
				console.log(`Unauthenticated request from ${sessionId}`);
				const errorMsg: ServerMessage = {
					type: 'auth_error',
					error: 'Not authenticated',
				};
				sendAndClose(ws, errorMsg, 4001, 'Not authenticated');
				return;
			}

			// Route to appropriate handler
			await this.routeMessage(clientMsg, sessionId, ws);
		} catch (error) {
			console.error('Error handling WebSocket message:', error);
			sendMessage(ws, { type: 'chat_ended' });
		}
	}

	/**
	 * Route message to appropriate handler
	 */
	private async routeMessage(clientMsg: ClientMessage, sessionId: string, ws: WebSocket): Promise<void> {
		switch (clientMsg.type) {
			case 'search':
				await this.handleSearch(sessionId, ws);
				break;
			case 'message':
				await this.routingService.handleMessage(sessionId, ws, clientMsg.text, clientMsg.imageUrl);
				break;
			case 'end_chat':
				await this.handleEndChat(sessionId, ws);
				break;
			case 'ping':
				sendMessage(ws, { type: 'pong' } as PongMessage);
				break;
			case 'typing_start':
				await this.routingService.handleTypingStart(sessionId);
				break;
			case 'typing_stop':
				await this.routingService.handleTypingStop(sessionId);
				break;
			default:
				console.warn('Unknown message type:', clientMsg);
		}
	}

	/**
	 * Handle search request
	 */
	private async handleSearch(sessionId: string, ws: WebSocket): Promise<void> {
		const connection = this.connections.get(sessionId);

		// Release current partner if exists
		if (connection?.currentPartnerId) {
			await this.matchingService.releasePartner(sessionId, connection.currentPartnerId, this.queueService);
		}

		// Add delay for better UX
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Find available user
		let availableUser: string | null = null;
		while (true) {
			availableUser = this.queueService.dequeue();
			await this.queueService.persist();
			
			if (availableUser === null) {
				break;
			} else if (!this.connections.get(availableUser)) {
				continue; // Skip disconnected users
			} else {
				break;
			}
		}

		if (availableUser === null) {
			// No available users, add to queue
			if (!this.queueService.contains(sessionId)) {
				this.queueService.enqueue(sessionId);
				await this.queueService.persist();
			}
			sendMessage(ws, { type: 'searching' } as SearchingMessage);
		} else {
			// Match found
			console.log('Match found!');
			await this.matchingService.matchUsers(sessionId, availableUser);
		}
	}

	/**
	 * Handle end chat request
	 */
	private async handleEndChat(sessionId: string, ws: WebSocket): Promise<void> {
		const connection = this.connections.get(sessionId);
		
		if (connection?.currentPartnerId) {
			await this.matchingService.releasePartner(sessionId, connection.currentPartnerId, this.queueService);
		}

		this.connections.delete(sessionId);
		await this.matchingService.persistPartnerRelationships();

		sendAndClose(ws, { type: 'chat_ended' } as ChatEndedMessage, 1000, 'Chat ended');
	}

	/**
	 * Handle WebSocket close
	 */
	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
		console.log(`WebSocket closed: code=${code}, reason=${reason}, wasClean=${wasClean}`);

		const sessionId = getSessionId(ws);
		if (sessionId) {
			await this.handleDisconnect(sessionId);
		} else {
			// Fallback: find by WebSocket reference
			for (const [id, conn] of this.connections.entries()) {
				if (conn.ws === ws) {
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
		
		const sessionId = getSessionId(ws);
		if (sessionId) {
			await this.handleDisconnect(sessionId);
		} else {
			for (const [id, conn] of this.connections.entries()) {
				if (conn.ws === ws) {
					await this.handleDisconnect(id);
					break;
				}
			}
		}
	}

	/**
	 * Handle user disconnect
	 */
	private async handleDisconnect(sessionId: string): Promise<void> {
		console.log(`Handling disconnect for session: ${sessionId}`);
		
		const connection = this.connections.get(sessionId);
		if (connection?.currentPartnerId) {
			console.log(`User ${sessionId} had partner ${connection.currentPartnerId}, releasing...`);
			await this.matchingService.releasePartner(sessionId, connection.currentPartnerId, this.queueService);
		}

		this.connections.delete(sessionId);
		await this.authService.persistAuthState();
		await this.matchingService.persistPartnerRelationships();

		console.log(`Session ${sessionId} removed from connections`);
	}
}
