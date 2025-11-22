/**
 * TypeScript definitions for environment variables
 * These types provide autocomplete and type safety for Config values from react-native-config
 */

declare module 'react-native-config' {
  export interface NativeConfig {
    WEBSOCKET_URL?: string;
    API_KEY?: string;
    RECONNECT_INTERVAL?: string;
    MAX_RECONNECT_ATTEMPTS?: string;
    PING_INTERVAL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
