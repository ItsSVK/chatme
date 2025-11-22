/**
 * App Configuration
 * Centralized configuration for the app
 * 
 * Environment variables are loaded from .env file using react-native-config
 * See .env.example for required variables
 */

import EnvConfig from 'react-native-config';

// WebSocket configuration
// For local development, use your local Cloudflare Worker URL
// For production, use your deployed Cloudflare Worker URL
// Example local: ws://localhost:8787
// Example production: wss://chatme-backend.your-subdomain.workers.dev

// IMPORTANT: For physical device testing, see PHYSICAL_DEVICE_SETUP.md
// Common solutions:
// - Android: Use "adb reverse tcp:8787 tcp:8787" and set to 'ws://localhost:8787'
// - iOS: Use ngrok or deploy to Cloudflare
// - Network IP: Ensure both devices on same Wi-Fi and firewall allows port 8787

export const Config = {
  // WebSocket URL from environment variables
  // Fallback to production URL if not set
  WEBSOCKET_URL:
    EnvConfig.WEBSOCKET_URL || 'ws://localhost:8787',

  // API Key for backend authentication from environment variables
  // Fallback to development key if not set (NOT RECOMMENDED for production)
  API_KEY: EnvConfig.API_KEY || 'chatme-mobile-dev-key-2024',

  // Reconnection settings (convert from string to number with fallbacks)
  RECONNECT_INTERVAL: EnvConfig.RECONNECT_INTERVAL
    ? parseInt(EnvConfig.RECONNECT_INTERVAL, 10)
    : 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: EnvConfig.MAX_RECONNECT_ATTEMPTS
    ? parseInt(EnvConfig.MAX_RECONNECT_ATTEMPTS, 10)
    : 5,

  // Ping/pong settings for keep-alive
  PING_INTERVAL: EnvConfig.PING_INTERVAL
    ? parseInt(EnvConfig.PING_INTERVAL, 10)
    : 30000, // 30 seconds
} as const;

