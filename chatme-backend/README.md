# ChatMe Backend ⚡

Cloudflare Workers backend for ChatMe anonymous chat platform.

## 🛠️ Tech Stack

- **Cloudflare Workers** - Serverless edge computing
- **Durable Objects** - Stateful WebSocket connections
- **TypeScript** - Type-safe development
- **WebSocket API** - Real-time bidirectional communication

## ✨ Features

- ⚡ Edge computing for low latency worldwide
- 💾 Stateful connections with Durable Objects
- 🔄 Queue-based matching algorithm
- 🔐 API key authentication
- 🌍 CORS protection
- 📊 Persistent state with hibernation support
- 🔌 WebSocket keep-alive (ping/pong)
- 🚀 Auto-scaling and high availability

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Cloudflare account (free tier works)
- Wrangler CLI

### Installation

1. **Install dependencies**
   ```bash
   cd chatme-backend
   npm install
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **Setup environment variables**
   ```bash
   cp .dev.vars.example .dev.vars
   ```

4. **Configure `.dev.vars`**
   ```env
   WEB_API_KEY=your-web-api-key
   MOBILE_API_KEY=your-mobile-api-key
   ```

5. **Start development server**
   ```bash
   npx wrangler dev
   ```

   Server will be available at `http://localhost:8787`

## 📁 Project Structure

```
chatme-backend/
├── src/
│   ├── index.ts         # Worker entry point, CORS handling
│   ├── chatqueue.ts     # Durable Object with queue logic
│   └── types.ts         # TypeScript type definitions
├── wrangler.jsonc       # Cloudflare configuration
├── .dev.vars           # Local environment variables (gitignored)
└── .dev.vars.example   # Environment template
```

## 🔧 Configuration

### wrangler.jsonc

```jsonc
{
  "name": "chatme-backend",
  "main": "src/index.ts",
  "compatibility_date": "2025-11-15",
  "durable_objects": {
    "bindings": [
      {
        "name": "CHAT_QUEUE",
        "class_name": "ChatQueue"
      }
    ]
  }
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEB_API_KEY` | API key for web app | Yes |
| `MOBILE_API_KEY` | API key for mobile app | Yes |

**Production:** Set these in Cloudflare Dashboard → Workers → Settings → Variables

## 🔌 WebSocket API

### Client → Server Messages

```typescript
// Authenticate
{ type: 'auth', apiKey: string }

// Find a chat partner
{ type: 'search' }

// Send a message
{ type: 'message', text?: string, imageUrl?: string }

// End current chat
{ type: 'end_chat' }

// Keep-alive ping
{ type: 'ping' }
```

### Server → Client Messages

```typescript
// Authentication successful
{ type: 'auth_success' }

// Authentication failed
{ type: 'auth_error', error: string }

// Searching for partner
{ type: 'searching' }

// Matched with partner
{ type: 'matched', partnerId: string }

// Received message
{ type: 'message', text?: string, imageUrl?: string, from: string }

// Partner disconnected
{ type: 'partner_disconnected' }

// Chat ended
{ type: 'chat_ended' }

// Keep-alive pong
{ type: 'pong' }
```

## 🏗️ Architecture

### Durable Object: ChatQueue

The `ChatQueue` Durable Object manages:
- WebSocket connections
- User matching queue
- Message routing
- State persistence
- Hibernation support

### Flow

1. Client connects to Worker
2. Worker validates CORS and routes to Durable Object
3. Durable Object accepts WebSocket
4. Client sends auth message
5. Durable Object validates API key
6. Client sends search message
7. Durable Object adds to queue or matches with waiting user
8. Messages are routed between matched partners

## 🚀 Deployment

### Deploy to Production

```bash
npx wrangler deploy
```

### Set Production Environment Variables

```bash
npx wrangler secret put WEB_API_KEY
npx wrangler secret put MOBILE_API_KEY
```

Or via Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Settings → Variables
4. Add `WEB_API_KEY` and `MOBILE_API_KEY`

### View Deployment

```bash
# Get deployment URL
npx wrangler deployments list

# View logs
npx wrangler tail
```

## 📊 Monitoring

### Real-Time Logs

```bash
npx wrangler tail
```

### Cloudflare Dashboard

1. **Analytics**
   - Request count
   - Error rate
   - Latency (P50, P95, P99)

2. **Logs**
   - Real-time WebSocket events
   - Error tracking
   - Performance metrics

3. **Durable Objects**
   - Active connections
   - Storage usage
   - Compute time

## 🔐 Security

### CORS Configuration

Edit `src/index.ts` to add allowed origins:

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:5173',           // Web dev
  'http://localhost:3000',           // Mobile dev
  'http://localhost:8787',           // React Native
  'https://chatme.itssvk.dev',       // Production web
  'https://your-domain.com',         // Add your domain
];
```

### API Key Authentication

All WebSocket connections require authentication:

```typescript
// Client must send this first
{ type: 'auth', apiKey: 'your-api-key' }
```

## 🐛 Troubleshooting

### Deployment Issues

**Problem:** `wrangler deploy` fails

**Solutions:**
- Ensure you're logged in: `npx wrangler login`
- Check `wrangler.jsonc` syntax
- Verify account has Workers enabled

### WebSocket Connection Refused

**Problem:** Clients can't connect

**Solutions:**
- Check CORS configuration includes client origin
- Verify API keys are set correctly
- Check Cloudflare Dashboard for errors

### Durable Object Errors

**Problem:** State not persisting

**Solutions:**
- Ensure Durable Objects are enabled in your account
- Check storage limits
- Review logs for errors

## 📈 Scaling

### Automatic Scaling

Cloudflare Workers automatically scale based on traffic:
- No configuration needed
- Handles millions of requests
- Global edge network

### Limits (Free Tier)

- 100,000 requests/day
- 10ms CPU time per request
- 128MB memory per request

### Upgrading

For higher limits, upgrade to Workers Paid plan:
- Unlimited requests
- 50ms CPU time
- 128MB memory

## 🧪 Testing

### Local Testing

```bash
# Start local server
npx wrangler dev

# Test WebSocket connection
# Use a WebSocket client or your frontend app
```

### Production Testing

```bash
# Deploy to staging
npx wrangler deploy --env staging

# Monitor logs
npx wrangler tail --env staging
```

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

[← Back to Main README](../README.md)
