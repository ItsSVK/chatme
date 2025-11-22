# ChatMe - React Native Frontend

Anonymous random chat app built with React Native and WebSocket.

## Features

- 🔒 **Anonymous**: No registration required
- ⚡ **Real-time**: Instant message delivery via WebSocket
- 🌍 **Random Matching**: Queue-based algorithm pairs users randomly
- 🔄 **Skip Partner**: Find new chat partners with "Next" button
- 📱 **Cross-platform**: Works on iOS and Android
- 🎨 **Modern UI**: Beautiful animations and smooth transitions
- 🔌 **Auto-reconnect**: Handles network issues gracefully

## Prerequisites

- Node.js >= 20
- React Native development environment setup
- iOS: Xcode and CocoaPods
- Android: Android Studio and Java SDK

## Installation

```bash
npm install

# iOS only
cd ios && pod install && cd ..
```

## Configuration

Update WebSocket URL in `src/config/index.ts`:

```typescript
WEBSOCKET_URL: 'wss://your-backend-url.workers.dev'
```

## Running

### iOS

```bash
npm run ios
# or
npx react-native run-ios
```

### Android

```bash
npm run android
# or
npx react-native run-android
```

## Project Structure

```
src/
├── screens/          # Screen components
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   └── ChatScreen.tsx
├── hooks/            # Custom React hooks
│   └── useChatWebSocket.ts
├── types/            # TypeScript types
│   ├── index.ts
│   └── websocket.ts
├── config/           # App configuration
│   └── index.ts
├── constants/        # Colors, theme, etc.
├── assets/           # Images and resources
└── components/       # Reusable components
```

## WebSocket Integration

The app uses a custom `useChatWebSocket` hook that manages:

- WebSocket connection lifecycle
- Message sending/receiving
- Connection state management
- Auto-reconnection logic
- Keep-alive pings

### Usage Example

```typescript
import { useChatWebSocket } from '../hooks/useChatWebSocket';

function ChatScreen() {
  const {
    connectionState,
    messages,
    sendMessage,
    startSearch,
    endChat,
    partnerId,
    disconnect,
  } = useChatWebSocket();

  // Connection states: 'disconnected' | 'connecting' | 'connected' | 'searching' | 'matched' | 'error'
}
```

## Testing

### Unit Tests

```bash
npm test
```

### E2E Testing (Manual)

1. Run app on two devices/simulators
2. Click "Start Chatting" on both
3. Verify matching occurs
4. Send messages from both sides
5. Test "Next" and "End Chat" buttons

## Troubleshooting

### Metro Bundler Issues

```bash
npx react-native start --reset-cache
```

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

### WebSocket Not Connecting

- Verify backend is deployed and accessible
- Check WebSocket URL in `src/config/index.ts`
- For Android local testing, use IP address instead of `localhost`
- Check network permissions in AndroidManifest.xml

## Scripts

- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm start` - Start Metro bundler
- `npm test` - Run tests
- `npm run lint` - Lint code

## Dependencies

### Core
- React 19.1.1
- React Native 0.82.1
- react-native-safe-area-context

### Dev Dependencies
- TypeScript
- ESLint
- Jest
- Babel

## License

MIT

## Support

For setup and integration help, see:
- `../QUICK_START.md` - Quick setup guide
- `../INTEGRATION_GUIDE.md` - Detailed integration guide
