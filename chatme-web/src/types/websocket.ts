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
  type: 'auth' | 'search' | 'message' | 'end_chat' | 'ping' | 'typing_start' | 'typing_stop';
  apiKey?: string;
  text?: string;
  imageUrl?: string;
}

// Server → Client message types
export interface ServerMessage {
  type: 'auth_success' | 'auth_error' | 'session_id' | 'matched' | 'searching' | 'message' | 'partner_disconnected' | 'pong' | 'chat_ended' | 'typing_start' | 'typing_stop';
  sessionId?: string;
  partnerId?: string;
  text?: string;
  imageUrl?: string;
  from?: string;
  error?: string;
}
