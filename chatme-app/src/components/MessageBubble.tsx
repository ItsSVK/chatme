/**
 * MessageBubble Component
 * Individual chat message bubble with timestamp
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';
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
  return (
    <View>
      {showDate && dateText && (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>{dateText}</Text>
        </View>
      )}
      <View
        style={[
          styles.messageWrapper,
          message.isUser && styles.messageWrapperRight,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userMessage : styles.otherMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isUser
                ? styles.userMessageText
                : styles.otherMessageText,
            ]}
          >
            {message.text}
          </Text>
        </View>
        {showTimestamp && (
          <Text style={styles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateSeparator: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  dateText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  userMessage: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  otherMessage: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: Theme.fontSize.md,
    lineHeight: 20,
    color: Colors.textDark,
  },
  userMessageText: {
    color: Colors.textDark,
  },
  otherMessageText: {
    color: Colors.textDark,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textGray,
    marginTop: 4,
    marginHorizontal: Theme.spacing.xs,
  },
});

