/**
 * WebSocket Message Types
 * These types match the backend protocol defined in chatme-backend/src/types.ts
 */

// Client → Server message types
export interface ClientMessage {
  type: 'search' | 'message' | 'end_chat' | 'ping';
  text?: string; // For message type
}

export interface SearchMessage extends ClientMessage {
  type: 'search';
}

export interface ChatMessage extends ClientMessage {
  type: 'message';
  text: string;
}

export interface EndChatMessage extends ClientMessage {
  type: 'end_chat';
}

export interface PingMessage extends ClientMessage {
  type: 'ping';
}

// Server → Client message types
export interface ServerMessage {
  type:
    | 'session_id'
    | 'matched'
    | 'searching'
    | 'message'
    | 'partner_disconnected'
    | 'pong'
    | 'chat_ended';
  sessionId?: string; // For session_id type
  partnerId?: string; // For matched type
  text?: string; // For message type
  from?: string; // For message type
}

export interface SessionIdMessage extends ServerMessage {
  type: 'session_id';
  sessionId: string;
}

export interface MatchedMessage extends ServerMessage {
  type: 'matched';
  partnerId: string;
}

export interface SearchingMessage extends ServerMessage {
  type: 'searching';
}

export interface ServerChatMessage extends ServerMessage {
  type: 'message';
  text: string;
  from: string;
}

export interface PartnerDisconnectedMessage extends ServerMessage {
  type: 'partner_disconnected';
}

export interface PongMessage extends ServerMessage {
  type: 'pong';
}

export interface ChatEndedMessage extends ServerMessage {
  type: 'chat_ended';
}

// Connection states
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'searching'
  | 'matched'
  | 'error';

