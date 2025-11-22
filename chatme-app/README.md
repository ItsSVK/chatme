# ChatMe Mobile App 📱

React Native mobile application for ChatMe anonymous chat platform.

## 🛠️ Tech Stack

- **React Native 0.82** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **react-native-config** - Environment variable management
- **WebSocket API** - Real-time communication
- **Custom Hooks** - State management

## ✨ Features

- 🎨 Modern UI with smooth animations
- 🌓 Dark/Light theme support
- ⚡ Real-time messaging via WebSocket
- 🎭 Emoji support and quick reactions
- 📱 Native iOS and Android support
- 🔄 Auto-reconnection on network loss
- 📊 Optimized for small screens
- 🔐 Secure environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- React Native development environment
  - **iOS**: Xcode 14+, CocoaPods
  - **Android**: Android Studio, JDK 17+

### Installation

1. **Install dependencies**
   ```bash
   cd chatme-app
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`**
   ```env
   WEBSOCKET_URL=wss://your-backend.workers.dev
   API_KEY=your-api-key-here
   RECONNECT_INTERVAL=3000
   MAX_RECONNECT_ATTEMPTS=5
   PING_INTERVAL=30000
   ```

4. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📁 Project Structure

```
chatme-app/
├── src/
│   ├── screens/            # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── components/         # Reusable components
│   │   ├── AnimatedBackground.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── MessageList.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatActions.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useChatWebSocket.ts
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx
│   ├── types/              # TypeScript types
│   │   └── websocket.ts
│   ├── config/             # App configuration
│   │   └── index.ts
│   ├── constants/          # Theme, colors
│   └── assets/             # Images, fonts
├── android/                # Android native code
├── ios/                    # iOS native code
└── App.tsx                 # Root component
```

## 🔧 Available Scripts

```bash
npm run android        # Run on Android
npm run ios            # Run on iOS
npm start              # Start Metro bundler
npm run lint           # Run ESLint
npm test               # Run tests
```

### Build Scripts

```bash
# Android
npm run build:android:apk    # Build APK
npm run build:android:aab    # Build AAB (for Play Store)
npm run build:android:clean  # Clean build

# iOS
# Use Xcode to build and archive
```

## 🌍 Environment Variables

Environment variables are managed using `react-native-config`.

| Variable | Description | Default |
|----------|-------------|---------|
| `WEBSOCKET_URL` | WebSocket server URL | - |
| `API_KEY` | API key for authentication | - |
| `RECONNECT_INTERVAL` | Reconnection interval (ms) | 3000 |
| `MAX_RECONNECT_ATTEMPTS` | Max reconnection attempts | 5 |
| `PING_INTERVAL` | Keep-alive ping interval (ms) | 30000 |

### Important Notes

- **Rebuild required**: After changing `.env`, you must rebuild the app (not just reload)
- **No quotes**: Don't use quotes in `.env` file values
- **Platform-specific**: iOS and Android may need separate builds after env changes

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment setup guide.

## 📱 Platform-Specific Setup

### iOS

1. **Install CocoaPods dependencies**
   ```bash
   cd ios && pod install && cd ..
   ```

2. **Open in Xcode**
   ```bash
   open ios/ChatMe.xcworkspace
   ```

3. **Configure signing**
   - Select your development team
   - Update bundle identifier

### Android

1. **Open in Android Studio**
   ```bash
   open -a "Android Studio" android/
   ```

2. **Update app ID** (optional)
   - Edit `android/app/build.gradle`
   - Change `applicationId`

## 🔌 WebSocket Integration

The app uses a custom `useChatWebSocket` hook:

```typescript
import { useChatWebSocket } from '../hooks/useChatWebSocket';

const {
  connectionState,
  messages,
  sendMessage,
  startSearch,
  endChat,
  partnerId,
} = useChatWebSocket();
```

## 🎨 Theming

The app supports dark and light themes. Theme is managed via `ThemeContext`:

```typescript
import { useTheme } from '../contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
```

## 🐛 Troubleshooting

### Environment Variables Not Loading

**Problem:** App uses fallback values instead of `.env` values

**Solutions:**
1. Rebuild the app completely (not just reload)
2. Clean build:
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   
   # iOS
   cd ios && pod install && cd ..
   ```
3. Verify no quotes in `.env` file
4. Check `react-native-config` is properly linked

### Connection Issues on Android

**Problem:** Can't connect to `localhost` backend

**Solutions:**
- Use your computer's IP address instead of `localhost`
- Or use `adb reverse`:
  ```bash
  adb reverse tcp:8787 tcp:8787
  ```

### iOS Build Errors

**Problem:** CocoaPods or build errors

**Solutions:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## 🚀 Deployment

### Android

1. **Generate signing key**
   ```bash
   keytool -genkey -v -keystore chatme-release-key.keystore -alias chatme -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/gradle.properties`

3. **Build release**
   ```bash
   npm run build:android:aab
   ```

4. **Upload to Google Play Console**

### iOS

1. **Open Xcode**
2. **Select "Any iOS Device"**
3. **Product → Archive**
4. **Distribute App → App Store Connect**

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

[← Back to Main README](../README.md)
