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
 */
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Re-export WebSocket types
export * from './websocket';

// Re-export enums (uncomment when you add enums to enums.ts)
// export * from './enums';
