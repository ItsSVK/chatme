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

// Re-export WebSocket types
export * from './websocket';

