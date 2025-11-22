# Code Refactoring Plan

## Current Issues

### File Sizes (Too Large!)
- ❌ **ChatScreen.tsx**: 992 lines (Should be ~200-300 lines)
- ❌ **SplashScreen.tsx**: 478 lines (Should be ~200-300 lines)
- ⚠️ **HomeScreen.tsx**: 247 lines (Acceptable, but can be improved)

### Problems Identified

#### ChatScreen.tsx Issues:
1. **Constants in component** - Emoji arrays should be in constants
2. **Message interface** - Should be in types folder
3. **Utility functions** - formatTime, formatDate, shouldShowDate, shouldShowTimestamp should be in utils
4. **Large StyleSheet** - 67+ styles (should be split or extracted)
5. **Complex sub-components** - EmojiPicker, MessageList, ChatHeader should be separate components
6. **Animation logic** - Could be custom hooks
7. **Too many responsibilities** - UI, logic, formatting, animations all in one file

#### SplashScreen.tsx Issues:
1. **Animation logic** - Should be custom hook
2. **Large StyleSheet** - Should be extracted
3. **Multiple animated components** - Could be separate components

#### HomeScreen.tsx Issues:
1. **Animation logic** - Could be custom hook
2. **Button component** - Could be reusable component
3. **Feature list** - Could be separate component

## Best Practices

### Component Size
- ✅ **200-300 lines max** per component file
- ✅ **Single Responsibility Principle** - One component, one purpose
- ✅ **Composition over Monolith** - Break into smaller pieces

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ChatHeader.tsx
│   ├── MessageBubble.tsx
│   ├── MessageList.tsx
│   ├── EmojiPicker.tsx
│   ├── LoadingDots.tsx
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useKeyboard.ts
│   ├── useAnimations.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── dateFormatting.ts
│   ├── messageHelpers.ts
│   └── index.ts
├── constants/          # Constants
│   ├── emojis.ts
│   └── index.ts
└── screens/            # Screen components (should be thin)
    ├── ChatScreen.tsx  # ~200 lines (orchestrates components)
    └── ...
```

## Refactoring Strategy

### Phase 1: Extract Constants & Types
1. Move emoji arrays to `constants/emojis.ts`
2. Move Message interface to `types/index.ts`

### Phase 2: Extract Utilities
1. Create `utils/dateFormatting.ts` for time/date formatting
2. Create `utils/messageHelpers.ts` for message display logic

### Phase 3: Extract Components
1. Create `components/ChatHeader.tsx`
2. Create `components/MessageBubble.tsx`
3. Create `components/MessageList.tsx`
4. Create `components/EmojiPicker.tsx`
5. Create `components/LoadingDots.tsx`
6. Create `components/ChatInput.tsx`
7. Create `components/ChatActions.tsx`

### Phase 4: Extract Hooks
1. Create `hooks/useKeyboard.ts` for keyboard handling
2. Create `hooks/useAnimations.ts` for animation logic

### Phase 5: Refactor Screens
1. Refactor ChatScreen to use extracted components
2. Refactor SplashScreen to use animation hook
3. Refactor HomeScreen to use extracted components

## Target Structure

### ChatScreen.tsx (After Refactoring)
```typescript
// ~200 lines - Just orchestrates components
export default function ChatScreen({ onEndChat, onNextChat }) {
  const { connectionState, messages, ... } = useChatWebSocket();
  const { keyboardHeight } = useKeyboard();
  
  return (
    <SafeAreaView>
      <ChatHeader 
        contactName={contactName}
        contactStatus={contactStatus}
      />
      <MessageList messages={messages} />
      <EmojiPicker 
        visible={showEmojiPicker}
        onSelect={handleEmojiSelect}
      />
      <ChatInput 
        message={message}
        onSend={handleSend}
        connectionState={connectionState}
      />
      <ChatActions 
        onEndChat={handleEndChat}
        onNextChat={handleNextChat}
      />
    </SafeAreaView>
  );
}
```

## Benefits

1. **Maintainability** - Easier to find and fix bugs
2. **Reusability** - Components can be reused elsewhere
3. **Testability** - Smaller units are easier to test
4. **Readability** - Clear separation of concerns
5. **Performance** - Better code splitting opportunities
6. **Team Collaboration** - Multiple developers can work on different components

## Implementation Priority

1. **High Priority**: Extract constants, types, and utilities (quick wins)
2. **Medium Priority**: Extract major components (ChatHeader, MessageList, EmojiPicker)
3. **Low Priority**: Extract hooks and minor optimizations

