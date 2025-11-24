/**
 * Connection utility functions
 * Centralizes common connection operations to eliminate code duplication
 */

interface UserConnection {
	sessionId: string;
	ws: WebSocket;
	currentPartnerId: string | null;
	isAuthenticated: boolean;
}

/**
 * Extract session ID from WebSocket
 */
export function getSessionId(ws: WebSocket): string {
	return ws.deserializeAttachment() as string;
}

/**
 * Get connection by session ID with validation
 */
export function getConnection(
	connections: Map<string, UserConnection>,
	sessionId: string
): UserConnection | null {
	return connections.get(sessionId) || null;
}

/**
 * Get partner connection for a given session
 * Returns null if user has no partner or partner doesn't exist
 */
export function getPartnerConnection(
	connections: Map<string, UserConnection>,
	sessionId: string
): { connection: UserConnection; partnerConnection: UserConnection } | null {
	const connection = connections.get(sessionId);
	if (!connection || !connection.currentPartnerId) {
		return null;
	}

	const partnerConnection = connections.get(connection.currentPartnerId);
	if (!partnerConnection) {
		return null;
	}

	return { connection, partnerConnection };
}

/**
 * Check if a connection is authenticated
 */
export function isAuthenticated(
	connections: Map<string, UserConnection>,
	sessionId: string
): boolean {
	const connection = connections.get(sessionId);
	return connection?.isAuthenticated ?? false;
}

/**
 * Update connection WebSocket reference
 */
export function updateWebSocket(
	connections: Map<string, UserConnection>,
	sessionId: string,
	ws: WebSocket
): void {
	const connection = connections.get(sessionId);
	if (connection) {
		connection.ws = ws;
	}
}
