/**
 * Message utility functions
 * Centralizes message sending with error handling to eliminate code duplication
 */

import type { ServerMessage } from '../types';

/**
 * Safely send a message to a WebSocket with error handling
 */
export function sendMessage(ws: WebSocket, message: ServerMessage): boolean {
	try {
		ws.send(JSON.stringify(message));
		return true;
	} catch (error) {
		console.error('Error sending message:', error);
		return false;
	}
}

/**
 * Safely close a WebSocket with error handling
 */
export function closeWebSocket(ws: WebSocket, code: number, reason: string): void {
	try {
		ws.close(code, reason);
	} catch (error) {
		console.error('Error closing WebSocket:', error);
	}
}

/**
 * Send a message and close the WebSocket
 */
export function sendAndClose(
	ws: WebSocket,
	message: ServerMessage,
	code: number,
	reason: string
): void {
	sendMessage(ws, message);
	closeWebSocket(ws, code, reason);
}
