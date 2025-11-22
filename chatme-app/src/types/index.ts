/**
 * TypeScript type definitions
 * Centralized type definitions for the app
 */

export interface SplashScreenProps {
  onFinish: () => void;
}

export interface HomeScreenProps {
  onStartChat: () => void;
}

export interface ChatScreenProps {
  onEndChat: () => void;
  onNextChat: () => void;
}

export interface NavigationProps {
  // Add navigation props here when you add navigation
}

/**
 * Message interface for chat messages
 * Supports text, GIFs, and stickers from system keyboard
 */
export interface Message {
  id: string;
  text?: string; // Optional for GIF/sticker messages
  imageUrl?: string; // For GIFs and stickers (can be URL or base64 data URI)
  isUser: boolean;
  timestamp: Date;
}

// Re-export WebSocket types
export * from './websocket';

// Re-export enums (uncomment when you add enums to enums.ts)
// export * from './enums';
