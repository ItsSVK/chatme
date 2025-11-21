/**
 * WebSocket message types matching the backend protocol
 */

// Connection states
export type ConnectionState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'searching' 
  | 'matched' 
  | 'error';

// Client → Server message types
export interface ClientMessage {
  type: 'search' | 'message' | 'end_chat' | 'ping';
  text?: string;
  imageUrl?: string;
}

// Server → Client message types
export interface ServerMessage {
  type: 'session_id' | 'matched' | 'searching' | 'message' | 'partner_disconnected' | 'pong' | 'chat_ended';
  sessionId?: string;
  partnerId?: string;
  text?: string;
  imageUrl?: string;
  from?: string;
}
