/**
 * WebSocket Message Types
 * These types match the backend protocol defined in chatme-backend/src/types.ts
 */

type SEARCH = 'search';
type MESSAGE = 'message';
type END_CHAT = 'end_chat';
type PING = 'ping';
type SESSION_ID = 'session_id';
type PARTNER_DISCONNECTED = 'partner_disconnected';
type PONG = 'pong';
type CHAT_ENDED = 'chat_ended';

type DISCONNECTED = 'disconnected';
type CONNECTING = 'connecting';
type CONNECTED = 'connected';
type SEARCHING = 'searching';
type MATCHED = 'matched';
type ERROR = 'error';

// Client → Server message types
export interface ClientMessage {
  type: SEARCH | MESSAGE | END_CHAT | PING;
  text?: string; // For text message type
  imageUrl?: string; // For GIF/sticker message type
}

export interface SearchMessage extends ClientMessage {
  type: SEARCH;
}

export interface ChatMessage extends ClientMessage {
  type: MESSAGE;
  text?: string;
  imageUrl?: string;
}

export interface EndChatMessage extends ClientMessage {
  type: END_CHAT;
}

export interface PingMessage extends ClientMessage {
  type: PING;
}

// Server → Client message types
export interface ServerMessage {
  type:
    | SESSION_ID
    | MATCHED
    | SEARCHING
    | MESSAGE
    | PARTNER_DISCONNECTED
    | PONG
    | CHAT_ENDED;
  sessionId?: string; // For session_id type
  partnerId?: string; // For matched type
  text?: string; // For text message type
  imageUrl?: string; // For GIF/sticker message type
  from?: string; // For message type
}

export interface SessionIdMessage extends ServerMessage {
  type: SESSION_ID;
  sessionId: string;
}

export interface MatchedMessage extends ServerMessage {
  type: MATCHED;
  partnerId: string;
}

export interface SearchingMessage extends ServerMessage {
  type: SEARCHING;
}

export interface ServerChatMessage extends ServerMessage {
  type: MESSAGE;
  text?: string;
  imageUrl?: string;
  from: string;
}

export interface PartnerDisconnectedMessage extends ServerMessage {
  type: PARTNER_DISCONNECTED;
}

export interface PongMessage extends ServerMessage {
  type: PONG;
}

export interface ChatEndedMessage extends ServerMessage {
  type: CHAT_ENDED;
}

// Connection states
export type ConnectionState =
  | DISCONNECTED
  | CONNECTING
  | CONNECTED
  | SEARCHING
  | MATCHED
  | ERROR;
