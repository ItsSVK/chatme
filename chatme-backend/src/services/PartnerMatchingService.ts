/**
 * Partner Matching Service
 * Handles partner matching and relationship management
 */

import { sendMessage } from '../utils/messageUtils';
import type { MatchedMessage, PartnerDisconnectedMessage } from '../types';

interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean;
}

export class PartnerMatchingService {
	private connections: Map<string, UserConnection>;
	private storage: DurableObjectStorage;

	constructor(connections: Map<string, UserConnection>, storage: DurableObjectStorage) {
		this.connections = connections;
		this.storage = storage;
	}

	/**
	 * Match two users together
	 */
	async matchUsers(sessionId1: string, sessionId2: string): Promise<void> {
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

		sendMessage(conn1.ws, msg1);
		sendMessage(conn2.ws, msg2);
	}

	/**
	 * Release a partner (put them back in queue)
	 */
	async releasePartner(
		sessionId: string,
		partnerId: string,
		queueService: { enqueue: (id: string) => boolean; contains: (id: string) => boolean; persist: () => Promise<void> }
	): Promise<void> {
		const partnerConnection = this.connections.get(partnerId);
		if (partnerConnection) {
			partnerConnection.currentPartnerId = null;

			// Notify partner
			const msg: PartnerDisconnectedMessage = {
				type: 'partner_disconnected',
			};
			sendMessage(partnerConnection.ws, msg);

			// Put partner back in queue if they're still connected
			if (!queueService.contains(partnerId)) {
				queueService.enqueue(partnerId);
				await queueService.persist();
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
	 * Persist partner relationships to storage
	 */
	async persistPartnerRelationships(): Promise<void> {
		const relationships: Record<string, string> = {};

		// Build relationships map from connections
		for (const [sessionId, connection] of this.connections.entries()) {
			if (connection.currentPartnerId) {
				relationships[sessionId] = connection.currentPartnerId;
			}
		}

		try {
			await this.storage.put('partnerRelationships', relationships);
			console.log(`Persisted ${Object.keys(relationships).length} partner relationships`);
		} catch (error) {
			console.error('Error persisting partner relationships to storage:', error);
		}
	}

	/**
	 * Restore partner relationships from storage
	 */
	async restorePartnerRelationships(): Promise<void> {
		try {
			const storedPartners = await this.storage.get<Record<string, string>>('partnerRelationships');
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
	}
}
