# ChatMe Web - Anonymous Random Chat

A modern, aesthetic web version of ChatMe built with React, featuring beautiful animations, glassmorphism design, and real-time WebSocket communication.

## ✨ Features

- 🔒 **Anonymous** - No login, no registration
- ⚡ **Real-time** - Instant message delivery via WebSocket
- 🌍 **Random Matching** - Queue-based algorithm pairs users
- 🔄 **Skip Partner** - Find new chat partners with "Next" button
- 🎨 **Modern UI** - Glassmorphism, gradients, and smooth animations
- 🌓 **Dark/Light Theme** - Toggle between themes with persistence
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- Backend already deployed at `wss://chatme-backend.connectshouvik.workers.dev`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Framer Motion** - Smooth animations
- **React Router** - Navigation
- **WebSocket** - Real-time communication

## 📁 Project Structure

```
chatme-web/
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   ├── screens/             # Page components
│   ├── types/               # TypeScript types
│   ├── config/              # Configuration
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

## 🎨 Design Features

### Glassmorphism
- Frosted glass effect with backdrop blur
- Subtle borders and shadows
- Semi-transparent backgrounds

### Animations
- Framer Motion for smooth transitions
- Staggered entrance animations
- Hover and tap interactions
- Floating background orbs

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactions

### Theme Support
- Dark and light themes
- Smooth theme transitions
- localStorage persistence

## 🔌 WebSocket Integration

The web app uses the same backend as the mobile app:
- Backend URL: `wss://chatme-backend.connectshouvik.workers.dev`
- Auto-reconnection on network loss
- Keep-alive mechanism (ping/pong)
- Connection state management

### Message Flow

1. User opens chat screen
2. WebSocket connects to backend
3. Sends 'search' message
4. Backend matches with another user
5. Real-time messaging begins
6. User can "Next" to find new partner or "End Chat" to disconnect

## 🧪 Testing

### Run Two Browser Tabs

1. Open `http://localhost:5173` in two tabs
2. Click "Start Chatting" in both
3. Wait for matching
4. Send messages between tabs

### Test Checklist

- [ ] Home screen animations
- [ ] Theme toggle functionality
- [ ] WebSocket connection
- [ ] User matching
- [ ] Message sending/receiving
- [ ] Emoji picker
- [ ] "Next Chat" functionality
- [ ] "End Chat" and return to home
- [ ] Responsive design on different screen sizes
- [ ] Dark/Light theme switching

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to gh-pages branch
```

## 📝 Configuration

Edit `src/config/index.ts` to change WebSocket URL or other settings:

```typescript
export const Config = {
  WEBSOCKET_URL: 'wss://chatme-backend.connectshouvik.workers.dev',
  RECONNECT_INTERVAL: 3000,
  MAX_RECONNECT_ATTEMPTS: 5,
  PING_INTERVAL: 30000,
} as const;
```

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with:
- React
- Framer Motion
- Vite
- TypeScript
- WebSocket Protocol

---

**Made with ❤️ for anonymous chatting**

🌍 Connect with strangers worldwide • 💬 Chat anonymously • 🚀 Built with modern tech
