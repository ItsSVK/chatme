/**
 * WebSocket Hook for Chat
 * Manages WebSocket connection, messaging, and state for web
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Config } from '../config';
import type { ClientMessage, ServerMessage, ConnectionState, Message } from '../types';

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
}

export function useChatWebSocket(): UseChatWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const isManualDisconnect = useRef(false);

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
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      console.log('[WebSocket] Waiting for connection to be open');
      return;
    }
    console.log('[WebSocket] Starting search...');
    setConnectionState('searching');
    send({ type: 'search' });
  }, [send]);

  /**
   * Send a chat message
   */
  const sendMessage = useCallback((text: string) => {
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
  }, [send]);

  /**
   * Send an image
   */
  const sendImage = useCallback((imageBase64: string) => {
    if (!imageBase64 || !imageBase64.trim()) return;

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
  }, [send]);

  /**
   * End current chat and search for new partner
   */
  const endChat = useCallback(() => {
    console.log('[WebSocket] Ending chat...');
    setMessages([]);
    setPartnerId(null);
    startSearch();
  }, [startSearch]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

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
  }, [send]);

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data: ServerMessage = JSON.parse(event.data);
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
          reconnectAttempts.current = 0;
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
          setMessages([]);
          break;

        case 'pong':
          console.log('[WebSocket] Pong received');
          break;

        case 'chat_ended':
          console.log('[WebSocket] Chat ended');
          setMessages([]);
          setPartnerId(null);
          setConnectionState('connected');
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

    pingIntervalRef.current = window.setInterval(() => {
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
        
        // Start search after authentication
        startSearch();
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error('[WebSocket] ❌ Error:', error);
        setConnectionState('error');
      };

      ws.onclose = (event) => {
        console.log(`[WebSocket] 🔌 Closed: code=${event.code}, reason=${event.reason || 'No reason'}`);

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
          reconnectAttempts.current < Config.MAX_RECONNECT_ATTEMPTS &&
          window.location.pathname === '/chat'
        ) {
          reconnectAttempts.current++;
          console.log(`[WebSocket] 🔄 Reconnect attempt ${reconnectAttempts.current}/${Config.MAX_RECONNECT_ATTEMPTS}`);

          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect();
          }, Config.RECONNECT_INTERVAL);
        } else if (reconnectAttempts.current >= Config.MAX_RECONNECT_ATTEMPTS) {
          console.error('[WebSocket] ❌ Max reconnection attempts reached');
          setConnectionState('error');
        }
      };
    } catch (error) {
      console.error('[WebSocket] ❌ Connection error:', error);
      setConnectionState('error');
    }
  }, [handleMessage, setupPingInterval]);

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
      if (wsRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
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
  };
}
