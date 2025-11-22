# ChatMe Web App 🌐

React-based web application for ChatMe anonymous chat platform.

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **WebSocket API** - Real-time communication

## ✨ Features

- 🎨 Modern UI with glassmorphism effects
- 🌓 Dark/Light theme support
- ⚡ Real-time messaging via WebSocket
- 🎭 Emoji picker and quick reactions
- 📱 Responsive design for all screen sizes
- 🔄 Auto-reconnection on network loss
- 📊 Environment-aware logging

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd chatme-web
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure `.env.local`**
   ```env
   VITE_WEBSOCKET_URL=wss://your-backend.workers.dev
   VITE_API_KEY=your-api-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

## 📁 Project Structure

```
chatme-web/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # Common UI components
│   │   └── chat/           # Chat-specific components
│   ├── screens/            # Page components
│   │   ├── HomeScreen/
│   │   └── ChatScreen/
│   ├── hooks/              # Custom React hooks
│   │   └── useChatWebSocket.ts
│   ├── utils/              # Utility functions
│   │   └── logger.ts       # Environment-aware logger
│   ├── types/              # TypeScript types
│   ├── config/             # App configuration
│   └── App.tsx             # Root component
├── public/                 # Static assets
└── index.html             # HTML template
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WEBSOCKET_URL` | WebSocket server URL | `wss://chatme-backend.workers.dev` |
| `VITE_API_KEY` | API key for authentication | `your-secret-key` |

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client.

## 🎨 Customization

### Theme

Edit `src/constants/theme.ts` to customize colors, spacing, and typography:

```typescript
export const Theme = {
  colors: {
    primary: '#6366F1',
    // ... more colors
  },
  spacing: {
    sm: 8,
    md: 16,
    // ... more spacing
  },
};
```

### Components

All components are in `src/components/` and use TypeScript for type safety.

## 🔌 WebSocket Integration

The app uses a custom `useChatWebSocket` hook for WebSocket communication:

```typescript
import { useChatWebSocket } from '../hooks/useChatWebSocket';

const {
  connectionState,
  messages,
  sendMessage,
  startSearch,
  endChat,
} = useChatWebSocket();
```

## 📊 Logging

The app uses an environment-aware logger that only shows debug logs in development:

```typescript
import { logger } from '../utils/logger';

logger.debug('Only in development');
logger.info('Only in development');
logger.warn('Shows in both dev and prod');
logger.error('Shows in both dev and prod');
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to Cloudflare Pages

```bash
npx wrangler pages publish dist
```

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem:** Can't connect to WebSocket server

**Solutions:**
- Verify `VITE_WEBSOCKET_URL` in `.env.local`
- Ensure backend is running and accessible
- Check browser console for errors
- Verify CORS settings on backend

### Build Errors

**Problem:** Build fails with TypeScript errors

**Solutions:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript version compatibility
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

[← Back to Main README](../README.md)
