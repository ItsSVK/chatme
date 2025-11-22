# Backend Security Setup Guide

## Environment Variables

The backend requires API keys to be configured as **secrets** in Cloudflare Workers.

### Development (Local Testing)

Create a `.dev.vars` file in the backend root directory:

```env
WEB_API_KEY=chatme-web-dev-key-2024
MOBILE_API_KEY=chatme-mobile-dev-key-2024
```

> **Note:** The `.dev.vars` file is already gitignored and will be used automatically by `wrangler dev`.

### Production Deployment

Set the API keys as secrets using Wrangler CLI:

```bash
# Navigate to backend directory
cd chatme-backend

# Set web API key
npx wrangler secret put WEB_API_KEY
# When prompted, enter: chatme-web-dev-key-2024 (or your production key)

# Set mobile API key
npx wrangler secret put MOBILE_API_KEY
# When prompted, enter: chatme-mobile-dev-key-2024 (or your production key)
```

Alternatively, set them via the Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker (`chatme-backend`)
3. Go to Settings → Variables
4. Add encrypted variables:
   - `WEB_API_KEY`: `chatme-web-dev-key-2024`
   - `MOBILE_API_KEY`: `chatme-mobile-dev-key-2024`

## Generating Secure API Keys

For production, generate secure random keys:

```bash
# Generate a secure 32-character base64 key
openssl rand -base64 32
```

## Security Features

✅ **API Key Authentication**: All WebSocket connections must authenticate with a valid API key
✅ **CORS Protection**: Only allowed origins can connect from browsers
✅ **Origin Validation**: WebSocket upgrade requests validate the Origin header
✅ **Connection Isolation**: Unauthenticated connections are immediately closed

## Allowed Origins

Update the `ALLOWED_ORIGINS` array in `src/index.ts` for production:

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:5173',      // Web dev
  'http://localhost:5174',      // Web dev (alt port)
  'http://localhost:3000',      // Mobile dev
  'https://your-domain.com',    // Production web
  // Add more as needed
];
```

## Testing

### Local Development

1. Start the backend:
   ```bash
   npm run dev
   ```

2. The backend will run on `http://localhost:8787`

3. Test with the web app (make sure `.env.local` has the matching API key)

### Deployment

```bash
# Deploy to Cloudflare
npm run deploy
```

## Troubleshooting

### Authentication Failed
- Check that API keys match between frontend and backend
- Verify environment variables are set correctly
- Check console logs for authentication errors

### CORS Errors
- Ensure your origin is in the `ALLOWED_ORIGINS` list
- Check that the Origin header is being sent

### Connection Closed Immediately
- This usually means authentication failed
- Check the API key in your frontend `.env.local`
- Verify the backend has the correct secrets configured
