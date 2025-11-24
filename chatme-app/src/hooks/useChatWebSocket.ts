/**
 * WebSocket Hook for Chat
 * Manages WebSocket connection, messaging, and state
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Config } from '../config';
import type {
  ClientMessage,
  ServerMessage,
  ConnectionState,
} from '../types/websocket';

import type { Message } from '../types';

interface UseChatWebSocketReturn {
  connectionState: ConnectionState;
  messages: Message[];
  sendMessage: (text: string) => void;
  sendImage: (imageBase64: string) => void;
  startSearch: () => void;
  endChat: () => void;
  clearMessages: () => void;
  partnerId: string | null;
  disconnect: () => void;
  isPartnerTyping: boolean;
  notifyTyping: () => void;
}

export function useChatWebSocket(): UseChatWebSocketReturn {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isManualDisconnect = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  /**
   * Send a message through WebSocket
   */
  const send = useCallback((message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        console.log('[WebSocket] Sent:', message);
      } catch (error) {
        console.error('[WebSocket] Send error:', error);
      }
    } else {
      console.warn('[WebSocket] Cannot send - connection not open');
    }
  }, []);

  /**
   * Start search for a chat partner
   */
  const startSearch = useCallback(() => {
    // wait for ws to be connected
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      console.log('[WebSocket] Waiting for connection to be open');
      return;
    }
    console.log('[WebSocket] Starting search...');
    setConnectionState('searching');
    send({ type: 'search' });
  }, [send, wsRef.current?.readyState]);

  /**
   * Send a chat message (text only - URLs are not treated as images)
   */
  const sendMessage = useCallback(
    (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      // Add message to local state immediately
      const newMessage: Message = {
        id: Date.now().toString(),
        text: trimmedText,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);

      // Send to server
      send({ type: 'message', text: trimmedText });
    },
    [send],
  );

  /**
   * Send an image/GIF/sticker (base64 data URI only)
   */
  const sendImage = useCallback(
    (imageBase64: string) => {
      if (!imageBase64 || !imageBase64.trim()) return;

      // Validate it's a base64 data URI
      const { isBase64Image } = require('../utils/imageHelpers');
      if (!isBase64Image(imageBase64)) {
        console.warn('Invalid base64 image format');
        return;
      }

      // Add message to local state immediately
      const newMessage: Message = {
        id: Date.now().toString(),
        imageUrl: imageBase64.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);

      // Send to server
      send({ type: 'message', imageUrl: imageBase64.trim() });
    },
    [send],
  );

  /**
   * Notify partner that user is typing
   * Throttled to prevent spam - sends typing_start on first call,
   * then typing_stop after 2 seconds of inactivity
   */
  const notifyTyping = useCallback(() => {
    if (connectionState !== 'matched') return;

    // Send typing_start if not already typing
    if (!isTyping.current) {
      isTyping.current = true;
      send({ type: 'typing_start' });
      console.log('[WebSocket] Sent typing_start');
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to send typing_stop after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTyping.current = false;
      send({ type: 'typing_stop' });
      console.log('[WebSocket] Sent typing_stop');
    }, 2000);
  }, [connectionState, send]);

  /**
   * End current chat and search for new partner
   */
  const endChat = useCallback(() => {
    console.log('[WebSocket] Ending chat...');
    clearMessages();
    setPartnerId(null);
    startSearch();
  }, [startSearch]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    console.log('[WebSocket] Manual disconnect');
    isManualDisconnect.current = true;

    // Clear intervals and timeouts
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      try {
        send({ type: 'end_chat' });
        wsRef.current.close(1000, 'User disconnected');
      } catch (error) {
        console.error('[WebSocket] Error during disconnect:', error);
      }
      wsRef.current = null;
    }

    setConnectionState('disconnected');
    setMessages([]);
    setPartnerId(null);
    setIsPartnerTyping(false);
    isTyping.current = false;
  }, [send]);

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = useCallback((event: WebSocketMessageEvent) => {
    try {
      const data: ServerMessage = JSON.parse(event.data as string);
      console.log('[WebSocket] Received:', data);

      switch (data.type) {
        case 'auth_success':
          console.log('[WebSocket] ✅ Authentication successful');
          // Connection is now authenticated, ready to use
          break;

        case 'auth_error':
          console.error('[WebSocket] ❌ Authentication failed:', data.error);
          setConnectionState('error');
          // Close connection on auth failure
          if (wsRef.current) {
            wsRef.current.close(4001, 'Authentication failed');
          }
          break;

        case 'searching':
          console.log('[WebSocket] Searching for partner...');
          setConnectionState('searching');
          break;

        case 'matched':
          console.log('[WebSocket] Matched with partner:', data.partnerId);
          setConnectionState('matched');
          setPartnerId(data.partnerId || null);
          reconnectAttempts.current = 0; // Reset reconnect attempts on successful match
          break;

        case 'message':
          if (data.from && (data.text || data.imageUrl)) {
            const newMessage: Message = {
              id: `${data.from}-${Date.now()}`,
              text: data.text,
              imageUrl: data.imageUrl,
              isUser: false,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
          }
          break;

        case 'partner_disconnected':
          console.log('[WebSocket] Partner disconnected');
          setPartnerId(null);
          setConnectionState('searching');
          clearMessages();
          // Optionally auto-search for new partner or show notification
          break;

        case 'pong':
          console.log('[WebSocket] Pong received');
          break;

        case 'chat_ended':
          console.log('[WebSocket] Chat ended');
          clearMessages();
          setPartnerId(null);
          setConnectionState('connected');
          break;

        case 'typing_start':
          console.log('[WebSocket] Partner started typing');
          setIsPartnerTyping(true);
          break;

        case 'typing_stop':
          console.log('[WebSocket] Partner stopped typing');
          setIsPartnerTyping(false);
          break;

        default:
          console.warn('[WebSocket] Unknown message type:', data);
      }
    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error);
    }
  }, []);

  /**
   * Setup ping interval for keep-alive
   */
  const setupPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        send({ type: 'ping' });
      }
    }, Config.PING_INTERVAL);
  }, [send]);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    // Don't connect if already connecting or connected
    if (
      wsRef.current?.readyState === WebSocket.CONNECTING ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      console.log('[WebSocket] Already connecting or connected');
      return;
    }

    // Don't reconnect if manually disconnected
    if (isManualDisconnect.current) {
      console.log('[WebSocket] Manual disconnect, not reconnecting');
      return;
    }

    console.log('[WebSocket] Connecting to:', Config.WEBSOCKET_URL);
    console.log('[WebSocket] Connection details:', {
      url: Config.WEBSOCKET_URL,
      protocol: Config.WEBSOCKET_URL.startsWith('ws://') ? 'ws' : 'wss',
    });
    setConnectionState('connecting');

    try {
      const ws = new WebSocket(Config.WEBSOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] ✅ Connected successfully');
        setConnectionState('connected');
        reconnectAttempts.current = 0;
        setupPingInterval();
        
        // Send API key for authentication
        if (Config.API_KEY) {
          console.log('[WebSocket] Sending API key for authentication...');
          send({ type: 'auth', apiKey: Config.API_KEY });
        } else {
          console.warn('[WebSocket] ⚠️ No API key configured');
        }
      };

      ws.onmessage = handleMessage;

      ws.onerror = error => {
        console.error('[WebSocket] ❌ Error:', error);
        // Try to get more error details
        if (error instanceof Error) {
          console.error('[WebSocket] Error message:', error.message);
          console.error('[WebSocket] Error stack:', error.stack);
        }
        // Check if it's a connection error
        const errorMessage =
          (error instanceof Error ? error.message : String(error)) || '';
        if (
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('Network request failed') ||
          errorMessage.includes('Failed to connect')
        ) {
          console.error('[WebSocket] 💡 Connection refused. Possible issues:');
          console.error(
            '  1. Backend not running? Check: cd chatme-backend && npx wrangler dev',
          );
          console.error(
            '  2. Wrong IP address? Verify with: ifconfig (Mac) or ipconfig (Windows)',
          );
          console.error('  3. Firewall blocking? Check firewall settings');
          console.error(
            '  4. Not on same network? Ensure device and laptop on same Wi-Fi',
          );
          console.error(
            '  5. For Android: Try "adb reverse tcp:8787 tcp:8787" and use localhost',
          );
          console.error(
            '  6. For iOS: Consider using ngrok or deploy to Cloudflare',
          );
        }
        setConnectionState('error');
      };

      ws.onclose = event => {
        console.log(
          `[WebSocket] 🔌 Closed: code=${event.code}, reason=${
            event.reason || 'No reason provided'
          }`,
        );

        // Log specific close codes for debugging
        if (event.code === 1006) {
          console.error(
            '[WebSocket] 💡 Abnormal closure (1006). Possible causes:',
          );
          console.error('  - Network connection lost');
          console.error('  - Server not reachable');
          console.error('  - Firewall blocking connection');
        } else if (event.code === 1000) {
          console.log('[WebSocket] Normal closure (1000)');
        }

        setConnectionState('disconnected');
        setPartnerId(null);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Attempt reconnection if not a manual disconnect
        if (
          !isManualDisconnect.current &&
          reconnectAttempts.current < Config.MAX_RECONNECT_ATTEMPTS
        ) {
          reconnectAttempts.current++;
          console.log(
            `[WebSocket] 🔄 Reconnect attempt ${reconnectAttempts.current}/${Config.MAX_RECONNECT_ATTEMPTS}`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, Config.RECONNECT_INTERVAL);
        } else if (reconnectAttempts.current >= Config.MAX_RECONNECT_ATTEMPTS) {
          console.error('[WebSocket] ❌ Max reconnection attempts reached');
          console.error('[WebSocket] 💡 Troubleshooting tips:');
          console.error('  - Check backend is running: npx wrangler dev');
          console.error('  - Verify IP address is correct');
          console.error('  - Check firewall settings');
          console.error('  - See PHYSICAL_DEVICE_SETUP.md for detailed help');
          setConnectionState('error');
        }
      };
    } catch (error) {
      console.error('[WebSocket] ❌ Connection error:', error);
      if (error instanceof Error) {
        console.error('[WebSocket] Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      setConnectionState('error');
    }
  }, [handleMessage, setupPingInterval]);

  /**
   * Handle app state changes (foreground/background)
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground, reconnect if needed
        if (
          !isManualDisconnect.current &&
          (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
        ) {
          console.log('[WebSocket] App active, reconnecting...');
          connect();
        }
      } else if (nextAppState === 'background') {
        // App went to background, keep connection but stop ping
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [connect]);

  /**
   * Initial connection and cleanup
   */
  useEffect(() => {
    isManualDisconnect.current = false;
    connect();

    return () => {
      // Cleanup on unmount
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [connect]);

  return {
    connectionState,
    messages,
    clearMessages,
    sendMessage,
    sendImage,
    startSearch,
    endChat,
    partnerId,
    disconnect,
    isPartnerTyping,
    notifyTyping,
  };
}
