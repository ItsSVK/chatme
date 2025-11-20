/**
 * MessageBubble Component
 * Individual chat message bubble with timestamp
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import type { Message } from '../types';
import { formatTime } from '../utils';

interface MessageBubbleProps {
  message: Message;
  showTimestamp: boolean;
  showDate?: boolean;
  dateText?: string | null;
}

export default function MessageBubble({
  message,
  showTimestamp,
  showDate,
  dateText,
}: MessageBubbleProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  return (
    <View>
      {showDate && dateText && (
        <View style={dynamicStyles.dateSeparator}>
          <Text style={dynamicStyles.dateText}>{dateText}</Text>
        </View>
      )}
      <View
        style={[
          dynamicStyles.messageWrapper,
          message.isUser && dynamicStyles.messageWrapperRight,
        ]}
      >
        <View
          style={[
            dynamicStyles.messageBubble,
            message.isUser ? dynamicStyles.userMessage : dynamicStyles.otherMessage,
          ]}
        >
          <Text
            style={[
              dynamicStyles.messageText,
              message.isUser
                ? dynamicStyles.userMessageText
                : dynamicStyles.otherMessageText,
            ]}
          >
            {message.text}
          </Text>
        </View>
        {showTimestamp && (
          <Text style={dynamicStyles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  dateSeparator: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  dateText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  messageWrapper: {
    marginBottom: Theme.spacing.xs,
    maxWidth: '75%',
  },
  messageWrapperRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: 18,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  userMessage: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  otherMessage: {
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  messageText: {
    fontSize: Theme.fontSize.md,
    lineHeight: 20,
    color: Colors.text,
  },
  userMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    marginHorizontal: Theme.spacing.xs,
  },
});

