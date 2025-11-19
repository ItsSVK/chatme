/**
 * WebSocket Message Types
 * These types match the backend protocol defined in chatme-backend/src/types.ts
 */

import {
  END_CHAT,
  PING,
  SEARCH,
  MESSAGE,
  SESSION_ID,
  MATCHED,
  SEARCHING,
  PONG,
  PARTNER_DISCONNECTED,
  CHAT_ENDED,
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
} from './enums';

// Client → Server message types
export interface ClientMessage {
  type: SEARCH | MESSAGE | END_CHAT | PING;
  text?: string; // For message type
}

export interface SearchMessage extends ClientMessage {
  type: SEARCH;
}

export interface ChatMessage extends ClientMessage {
  type: MESSAGE;
  text: string;
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
  text?: string; // For message type
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
  text: string;
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
