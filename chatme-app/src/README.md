# Source Code Structure

This directory contains all the source code for the ChatMe app, organized following React Native best practices.

## Folder Structure

```
src/
├── screens/          # Screen components (full-screen views)
├── components/       # Reusable UI components
├── constants/        # App-wide constants (colors, theme, etc.)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and helpers
├── navigation/       # Navigation configuration (when you add navigation)
└── assets/           # Images, fonts, and other static assets
```

## Directory Details

### `/screens`

Contains all screen components. Each screen is a full-screen view in your app.

**Current screens:**

- `SplashScreen.tsx` - Animated splash screen shown on app launch
- `HomeScreen.tsx` - Main home screen (where your chat interface will be)

**Usage:**

```typescript
import { SplashScreen, HomeScreen } from './src/screens';
```

### `/components`

Reusable UI components that can be used across multiple screens.

**Examples of components you might add:**

- `Button.tsx` - Custom button component
- `Input.tsx` - Text input component
- `ChatBubble.tsx` - Chat message bubble
- `UserAvatar.tsx` - User avatar component

**Usage:**

```typescript
import { Button, Input } from './src/components';
```

### `/constants`

Centralized constants for colors, theme, spacing, etc.

**Files:**

- `colors.ts` - All color definitions
- `theme.ts` - Theme constants (spacing, typography, shadows, etc.)

**Usage:**

```typescript
import { Colors, Theme } from './src/constants';
```

### `/types`

TypeScript type definitions and interfaces.

**Usage:**

```typescript
import type { SplashScreenProps } from './src/types';
```

### `/utils`

Utility functions and helpers used across the app.

**Examples:**

- Date formatting functions
- Validation helpers
- API helpers
- Common calculations

### `/navigation`

Navigation configuration (when you add React Navigation or similar).

### `/assets`

Static assets like images, fonts, icons, etc.

## Best Practices

1. **Screens vs Components**:

   - Screens are full-page views
   - Components are reusable pieces used within screens

2. **Constants**:

   - Always use constants from `/constants` instead of hardcoding values
   - Makes theming and updates easier

3. **Types**:

   - Define TypeScript types in `/types` for better type safety
   - Export types from `index.ts` for easy imports

4. **Barrel Exports**:

   - Use `index.ts` files to export from folders
   - Makes imports cleaner: `from './src/screens'` instead of `from './src/screens/SplashScreen'`

5. **File Naming**:
   - Use PascalCase for components: `SplashScreen.tsx`
   - Use camelCase for utilities: `formatDate.ts`
   - Use lowercase for constants: `colors.ts`
