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
import { Colors, Theme } from '../constants';
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
        styles.container,
        {
          transform: [{ scale: inputScaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.emojiButton,
          showEmojiPicker && styles.emojiButtonActive,
        ]}
        onPress={onToggleEmojiPicker}
        activeOpacity={0.7}
        disabled={isConnecting}
      >
        <Text
          style={[styles.emojiIcon, isConnecting && styles.emojiIconDisabled]}
        >
          😊
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textGray}
        value={message}
        onChangeText={onChangeText}
        multiline
        maxLength={500}
        editable={connectionState === 'matched'}
      />

      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Theme.spacing.sm : Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  emojiButton: {
    padding: Theme.spacing.xs,
    marginHorizontal: Theme.spacing.xs,
  },
  emojiButtonActive: {
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Colors.textDark,
    maxHeight: 100,
    marginHorizontal: Theme.spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textGray,
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: Theme.fontWeight.bold,
  },
});

