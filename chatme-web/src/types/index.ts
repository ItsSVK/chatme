/**
 * Common types for the ChatMe web app
 */

export interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  isUser: boolean;
  timestamp: Date;
}

export type Theme = 'light' | 'dark';

export * from './websocket';
