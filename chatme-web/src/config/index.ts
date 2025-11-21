/**
 * App Configuration
 * Centralized configuration for the ChatMe web app
 */

export const Config = {
  // WebSocket URL - using the deployed Cloudflare Worker
  WEBSOCKET_URL: import.meta.env.DEV && false
    ? 'ws://localhost:8787' // Local development
    : 'wss://chatme-backend.connectshouvik.workers.dev', // Production

  // Reconnection settings
  RECONNECT_INTERVAL: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 5,

  // Ping/pong settings for keep-alive
  PING_INTERVAL: 30000, // 30 seconds
} as const;
