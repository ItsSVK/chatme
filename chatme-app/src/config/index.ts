/**
 * App Configuration
 * Centralized configuration for the app
 */

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
  // Change this to your Cloudflare Worker WebSocket URL
  // When running locally with `wrangler dev`, it's typically http://localhost:8787
  // Make sure to use ws:// for local and wss:// for production
  WEBSOCKET_URL:
    __DEV__ && true
      ? 'ws://localhost:8787' // Local development (set to true when testing locally)
      : //   ? 'ws://192.168.29.70:8787' // Local development (set to true when testing locally)
        // ⚠️ For physical device: This may not work! See PHYSICAL_DEVICE_SETUP.md
        // Options:
        // 1. Android: Use "adb reverse tcp:8787 tcp:8787" then 'ws://localhost:8787'
        // 2. iOS: Use ngrok URL (wss://xxx.ngrok.io) or deploy to Cloudflare
        // 3. Network: Ensure same Wi-Fi, check firewall, verify IP with ifconfig/ipconfig
        'wss://chatme-backend.shouvikmohanta.workers.dev', // Production (update with your actual deployed URL)

  // Reconnection settings
  RECONNECT_INTERVAL: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 5,

  // Ping/pong settings for keep-alive
  PING_INTERVAL: 30000, // 30 seconds
} as const;
