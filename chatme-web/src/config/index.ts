/**
 * App Configuration
 * Centralized configuration for the ChatMe web app
 */

export const Config = {
  // WebSocket URL - using the deployed Cloudflare Worker
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8787',

  // API Key for backend authentication
  API_KEY: import.meta.env.VITE_API_KEY || 'chatme-web-dev-key-2024',

  // Reconnection settings
  RECONNECT_INTERVAL: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 5,

  // Ping/pong settings for keep-alive
  PING_INTERVAL: 30000, // 30 seconds
} as const;
