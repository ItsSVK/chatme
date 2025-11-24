/**
 * Message Routing Service
 * Handles routing messages between partners
 */

import { sendMessage } from '../utils/messageUtils';
import { getPartnerConnection } from '../utils/connectionUtils';
import type {
	ServerChatMessage,
	ServerTypingStartMessage,
	ServerTypingStopMessage,
} from '../types';

interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean;
}

export class MessageRoutingService {
	private connections: Map<string, UserConnection>;

	constructor(connections: Map<string, UserConnection>) {
		this.connections = connections;
	}

	/**
	 * Handle chat message (supports text and images/GIFs/stickers)
	 */
	async handleMessage(
		sessionId: string,
		ws: WebSocket,
		text?: string,
		imageUrl?: string
	): Promise<void> {
		const partner = getPartnerConnection(this.connections, sessionId);
		if (!partner) {
			sendMessage(ws, { type: 'partner_disconnected' });
			return;
		}

		// Validate that we have either text or imageUrl
		if (!text && !imageUrl) {
			console.warn('Message must have text or imageUrl');
			return;
		}

		// Send message to partner
		const msg: ServerChatMessage = {
			type: 'message',
			text: text,
			imageUrl: imageUrl,
			from: sessionId,
		};

		const sent = sendMessage(partner.partnerConnection.ws, msg);
		if (!sent) {
			// Partner connection is broken, clean up
			partner.connection.currentPartnerId = null;
		}
	}

	/**
	 * Forward typing event to partner (unified handler for start/stop)
	 */
	async forwardTypingEvent(
		sessionId: string,
		eventType: 'typing_start' | 'typing_stop'
	): Promise<void> {
		const partner = getPartnerConnection(this.connections, sessionId);
		if (!partner) {
			return; // Not connected to anyone, ignore
		}

		// Forward typing event to partner
		const msg: ServerTypingStartMessage | ServerTypingStopMessage = {
			type: eventType,
		};

		sendMessage(partner.partnerConnection.ws, msg);
	}

	/**
	 * Handle typing start event
	 */
	async handleTypingStart(sessionId: string): Promise<void> {
		await this.forwardTypingEvent(sessionId, 'typing_start');
	}

	/**
	 * Handle typing stop event
	 */
	async handleTypingStop(sessionId: string): Promise<void> {
		await this.forwardTypingEvent(sessionId, 'typing_stop');
	}
}
