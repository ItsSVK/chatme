/**
 * ChatInput Component
 * Input area with emoji button, text input, and send button
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import type { ConnectionState } from '../types/websocket';

interface ChatInputProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onToggleEmojiPicker: () => void;
  showEmojiPicker: boolean;
  connectionState: ConnectionState;
  isConnecting: boolean;
  inputScaleAnim: Animated.Value;
}

export default function ChatInput({
  message,
  onChangeText,
  onSend,
  onToggleEmojiPicker,
  showEmojiPicker,
  connectionState,
  isConnecting,
  inputScaleAnim,
}: ChatInputProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  const placeholder =
    connectionState === 'matched'
      ? 'Hey...'
      : connectionState === 'searching'
      ? 'Searching...'
      : 'Connecting...';

  const canSend = message.trim() && connectionState === 'matched';

  return (
    <Animated.View
      style={[
        dynamicStyles.container,
        {
          transform: [{ scale: inputScaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          dynamicStyles.emojiButton,
          showEmojiPicker && dynamicStyles.emojiButtonActive,
        ]}
        onPress={onToggleEmojiPicker}
        activeOpacity={0.7}
        disabled={isConnecting}
      >
        <Text
          style={[dynamicStyles.emojiIcon, isConnecting && dynamicStyles.emojiIconDisabled]}
        >
          😊
        </Text>
      </TouchableOpacity>

      <TextInput
        style={dynamicStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={message}
        onChangeText={onChangeText}
        multiline
        maxLength={500}
        editable={connectionState === 'matched'}
      />

      <TouchableOpacity
        style={[dynamicStyles.sendButton, !canSend && dynamicStyles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Text style={dynamicStyles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Theme.spacing.sm : Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    alignItems: 'center',
  },
  emojiButton: {
    padding: Theme.spacing.xs,
    marginHorizontal: Theme.spacing.xs,
  },
  emojiButtonActive: {
    backgroundColor: Colors.glassBackground,
    borderRadius: Theme.borderRadius.md,
  },
  emojiIcon: {
    fontSize: 24,
  },
  emojiIconDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.glassBackground,
    borderRadius: 20,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    maxHeight: 100,
    marginHorizontal: Theme.spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: Theme.fontWeight.bold,
  },
});

