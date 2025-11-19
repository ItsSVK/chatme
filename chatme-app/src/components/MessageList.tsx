/**
 * MessageList Component
 * Displays list of messages or empty state
 */

import React, { RefObject } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';
import type { Message } from '../types';
import { formatDate, shouldShowDate, shouldShowTimestamp } from '../utils';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';

interface MessageListProps {
  messages: Message[];
  isConnecting: boolean;
  scrollViewRef: RefObject<ScrollView>;
}

export default function MessageList({
  messages,
  isConnecting,
  scrollViewRef,
}: MessageListProps) {
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.messagesContainer}
      contentContainerStyle={styles.messagesContent}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
    >
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          {isConnecting ? (
            <>
              <View style={styles.emptyStateIconContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
              </View>
              <Text style={styles.emptyStateText}>
                Connecting to a random stranger
              </Text>
              <LoadingDots isAnimating={isConnecting} />
            </>
          ) : (
            <>
              <View style={styles.emptyStateIconContainer}>
                <Image
                  source={require('../assets/chatme.png')}
                  style={styles.emptyStateIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.emptyStateText}>
                Connected! Start chatting...
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Your messages will appear here
              </Text>
            </>
          )}
        </View>
      ) : (
        messages.map((msg, index) => {
          const previousMsg = index > 0 ? messages[index - 1] : null;
          const nextMsg =
            index < messages.length - 1 ? messages[index + 1] : null;
          const showDate = shouldShowDate(msg, previousMsg);
          const showTimestamp = shouldShowTimestamp(msg, nextMsg);
          const dateText = showDate ? formatDate(msg.timestamp) : null;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              showTimestamp={showTimestamp}
              showDate={showDate}
              dateText={dateText}
            />
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  messagesContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyStateIconContainer: {
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    width: 90,
    height: 90,
  },
  searchIcon: {
    fontSize: 64,
    color: Colors.textDark,
  },
  emptyStateText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
    marginBottom: Theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
    marginTop: Theme.spacing.xs,
  },
});

