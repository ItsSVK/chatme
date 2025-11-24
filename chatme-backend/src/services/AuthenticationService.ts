/**
 * Authentication Service
 * Handles API key validation and authentication state management
 */

import { sendMessage, closeWebSocket, sendAndClose } from '../utils/messageUtils';
import type { ServerMessage } from '../types';

interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean;
}

export class AuthenticationService {
	private connections: Map<string, UserConnection>;
	private storage: DurableObjectStorage;
	private env: Env;

	constructor(
		connections: Map<string, UserConnection>,
		storage: DurableObjectStorage,
		env: Env
	) {
		this.connections = connections;
		this.storage = storage;
		this.env = env;
	}

	/**
	 * Validate API key against environment variables
	 */
	validateApiKey(apiKey: string | undefined): boolean {
		if (!apiKey) {
			return false;
		}

		// Check against environment variables
		const validKeys = [this.env.WEB_API_KEY, this.env.MOBILE_API_KEY].filter(Boolean);

		return validKeys.includes(apiKey);
	}

	/**
	 * Handle authentication request
	 */
	async handleAuth(ws: WebSocket, apiKey: string | undefined): Promise<void> {
		const sessionId = ws.deserializeAttachment() as string;
		const connection = this.connections.get(sessionId);

		if (!connection) {
			console.log(`Connection not found for session: ${sessionId}`);
			closeWebSocket(ws, 4000, 'Connection not found');
			return;
		}

		if (this.validateApiKey(apiKey)) {
			// Authentication successful
			connection.isAuthenticated = true;
			await this.persistAuthState();
			const successMsg: ServerMessage = {
				type: 'auth_success',
			};
			sendMessage(ws, successMsg);
			console.log(`✅ Authentication successful for session: ${sessionId}`);
		} else {
			// Authentication failed
			const errorMsg: ServerMessage = {
				type: 'auth_error',
				error: 'Invalid API key',
			};
			sendAndClose(ws, errorMsg, 4001, 'Authentication failed');
			console.log(`❌ Authentication failed for session: ${sessionId}`);
		}
	}

	/**
	 * Check if a session is authenticated
	 */
	isAuthenticated(sessionId: string): boolean {
		const connection = this.connections.get(sessionId);
		return connection?.isAuthenticated ?? false;
	}

	/**
	 * Persist authenticated sessions to storage
	 */
	async persistAuthState(): Promise<void> {
		const authenticatedSessions = Array.from(this.connections.entries())
			.filter(([_, conn]) => conn.isAuthenticated)
			.map(([sessionId, _]) => sessionId);

		await this.storage.put('authenticatedSessions', authenticatedSessions);
		console.log(`Persisted ${authenticatedSessions.length} authenticated sessions`);
	}

	/**
	 * Restore authenticated sessions from storage
	 */
	async restoreAuthState(): Promise<void> {
		try {
			const authenticatedSessions = await this.storage.get<string[]>('authenticatedSessions');
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
	}
}
