# Environment Variables Setup Guide

This guide explains how to set up and use environment variables in the ChatMe React Native app.

## Overview

The app uses [`react-native-config`](https://github.com/luggit/react-native-config) to manage environment variables. This allows you to keep sensitive information (like API keys) out of version control.

## Quick Start

1. **Copy the template file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```env
   WEBSOCKET_URL=wss://your-backend-url.workers.dev
   API_KEY=your-actual-api-key
   ```

3. **Rebuild the app** (required for env changes to take effect):
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Available Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WEBSOCKET_URL` | WebSocket URL for backend connection | `wss://chatme-backend.workers.dev` |
| `API_KEY` | API key for backend authentication | `your-secret-key` |
| `RECONNECT_INTERVAL` | Reconnection interval in milliseconds | `3000` |
| `MAX_RECONNECT_ATTEMPTS` | Maximum reconnection attempts | `5` |
| `PING_INTERVAL` | Ping interval for keep-alive in milliseconds | `30000` |

## Different Environments

You can create multiple environment files for different environments:

- `.env` - Default environment (gitignored)
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

To use a specific environment file:

```bash
# Android
ENVFILE=.env.production npm run android

# iOS
ENVFILE=.env.production npm run ios
```

## Important Notes

> [!WARNING]
> **Always rebuild the app after changing `.env` files.** Hot reload will NOT pick up environment variable changes.

> [!CAUTION]
> **Never commit `.env` files to git.** They contain sensitive information and are already in `.gitignore`.

> [!TIP]
> For local development with a local backend:
> - Set `WEBSOCKET_URL=ws://localhost:8787`
> - For Android physical devices, use `adb reverse tcp:8787 tcp:8787`
> - For iOS physical devices, use ngrok or deploy to Cloudflare

## Accessing Environment Variables in Code

Environment variables are accessed through the centralized `Config` object:

```typescript
import { Config } from './config';

// Use the config values
const wsUrl = Config.WEBSOCKET_URL;
const apiKey = Config.API_KEY;
```

The config file automatically handles:
- Loading values from `.env`
- Type conversion (strings to numbers)
- Fallback values for missing variables
- TypeScript type safety

## Troubleshooting

### Changes not reflecting in the app
- **Solution:** Rebuild the app completely (not just reload)

### "Config is undefined" error
- **Solution:** Make sure you've installed dependencies with `npm install` and rebuilt the app

### Different values on iOS vs Android
- **Solution:** Clean build folders and rebuild both platforms:
  ```bash
  # Android
  cd android && ./gradlew clean && cd ..
  
  # iOS
  cd ios && pod install && cd ..
  ```

## Team Setup

When a new team member joins:

1. They should copy `.env.example` to `.env`
2. Ask for the actual values from the team lead
3. Fill in their `.env` file
4. Build the app

The `.env.example` file is tracked in git and serves as a template showing which variables are needed.
