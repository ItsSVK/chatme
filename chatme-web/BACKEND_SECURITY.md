# ChatMe Backend Security Implementation

This document provides the Cloudflare Worker code to implement API key authentication for your ChatMe backend.

## Backend Implementation (Cloudflare Worker)

### Step 1: Add Environment Variables

In your Cloudflare Workers dashboard:
1. Go to your worker settings
2. Add these environment variables as **Secrets**:
   - `WEB_API_KEY`: `chatme-web-dev-key-2024`
   - `MOBILE_API_KEY`: `chatme-mobile-dev-key-2024`

### Step 2: Update Worker Code

Add this code to your Cloudflare Worker:

```typescript
// Environment interface
interface Env {
  WEB_API_KEY: string;
  MOBILE_API_KEY: string;
  // ... your other environment variables
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-domain.com', // Replace with your production domain
];

/**
 * Validate API Key
 */
function validateApiKey(apiKey: string | null, env: Env): boolean {
  if (!apiKey) {
    return false;
  }
  
  return apiKey === env.WEB_API_KEY || apiKey === env.MOBILE_API_KEY;
}

/**
 * Handle CORS preflight
 */
function handleCORS(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  
  if (request.method === 'OPTIONS') {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Upgrade, Connection',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    return new Response('Forbidden', { status: 403 });
  }
  
  return null;
}

/**
 * Add CORS headers to response
 */
function addCORSHeaders(response: Response, origin: string | null): Response {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return response;
  }
  
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Main fetch handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }
    
    const origin = request.headers.get('Origin');
    
    // Handle WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      // Validate origin for WebSocket connections
      if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return new Response('Forbidden - Invalid origin', { status: 403 });
      }
      
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      // Handle WebSocket connection
      handleWebSocket(server, env);
      
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }
    
    // Regular HTTP response
    const response = new Response('ChatMe WebSocket Server', {
      headers: { 'Content-Type': 'text/plain' },
    });
    
    return addCORSHeaders(response, origin);
  },
};

/**
 * Handle WebSocket connection
 */
function handleWebSocket(ws: WebSocket, env: Env) {
  let isAuthenticated = false;
  let sessionId: string | null = null;
  
  ws.accept();
  
  ws.addEventListener('message', async (event) => {
    try {
      const data = JSON.parse(event.data as string);
      
      // Handle authentication
      if (data.type === 'auth') {
        if (validateApiKey(data.apiKey, env)) {
          isAuthenticated = true;
          ws.send(JSON.stringify({ type: 'auth_success' }));
          console.log('Client authenticated successfully');
        } else {
          ws.send(JSON.stringify({ 
            type: 'auth_error', 
            error: 'Invalid API key' 
          }));
          ws.close(4001, 'Authentication failed');
          console.log('Authentication failed - invalid API key');
          return;
        }
        return;
      }
      
      // Require authentication for all other messages
      if (!isAuthenticated) {
        ws.send(JSON.stringify({ 
          type: 'auth_error', 
          error: 'Not authenticated' 
        }));
        ws.close(4001, 'Not authenticated');
        return;
      }
      
      // Handle other message types (search, message, etc.)
      // ... your existing message handling code ...
      
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  ws.addEventListener('close', () => {
    console.log('WebSocket closed');
    // ... your existing cleanup code ...
  });
}
```

### Step 3: Test the Implementation

1. **Test with valid API key:**
   ```bash
   # Your web app should connect successfully
   ```

2. **Test with invalid API key:**
   ```bash
   # Should receive auth_error and connection closes
   ```

3. **Test without API key:**
   ```bash
   # Should receive auth_error and connection closes
   ```

## Security Features Implemented

✅ **API Key Authentication**: Validates requests with secret keys
✅ **CORS Protection**: Restricts browser access to allowed origins
✅ **Origin Validation**: Checks request sources for WebSocket connections
✅ **Authentication Required**: All messages require prior authentication

## Production Deployment

### Update Environment Variables

Replace development keys with production keys:

```env
WEB_API_KEY=your-secure-random-web-key-here
MOBILE_API_KEY=your-secure-random-mobile-key-here
```

Generate secure keys using:
```bash
# Generate a secure random key
openssl rand -base64 32
```

### Update Allowed Origins

Replace `https://your-domain.com` with your actual production domain.

### Update Web App

Update `.env.local` with production API key before deploying.

## Monitoring

Monitor your Cloudflare Worker logs for:
- Failed authentication attempts
- Suspicious activity patterns
- Rate limit violations

## Key Rotation

To rotate API keys:
1. Generate new keys
2. Update Cloudflare Worker environment variables
3. Update web app `.env.local`
4. Update mobile app configuration
5. Deploy changes

## Notes

- API keys in web apps can be extracted (acceptable trade-off for this use case)
- Combined with CORS and origin validation, provides good security
- Rate limiting can be added for additional protection
- Consider implementing request logging for security monitoring
