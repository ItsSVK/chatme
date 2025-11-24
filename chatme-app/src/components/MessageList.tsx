/**
 * MessageList Component
 * Displays list of messages or empty state
 */

import React, { RefObject } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import type { Message } from '../types';
import { formatDate, shouldShowDate, shouldShowTimestamp } from '../utils';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isConnecting: boolean;
  scrollViewRef: RefObject<ScrollView>;
  isPartnerTyping?: boolean;
}

export default function MessageList({
  messages,
  isConnecting,
  scrollViewRef,
  isPartnerTyping,
}: MessageListProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  return (
    <ScrollView
      ref={scrollViewRef}
      style={dynamicStyles.messagesContainer}
      contentContainerStyle={dynamicStyles.messagesContent}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
    >
      {messages.length === 0 ? (
        <View style={dynamicStyles.emptyState}>
          {isConnecting ? (
            <>
              <View style={dynamicStyles.emptyStateIconContainer}>
                <Text style={dynamicStyles.searchIcon}>🔍</Text>
              </View>
              <Text style={dynamicStyles.emptyStateText}>
                Connecting to a random stranger
              </Text>
              <LoadingDots isAnimating={isConnecting} />
            </>
          ) : (
            <>
              <View style={dynamicStyles.emptyStateIconContainer}>
                <Image
                  source={require('../assets/chatme.png')}
                  style={dynamicStyles.emptyStateIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={dynamicStyles.emptyStateText}>
                Connected! Start chatting...
              </Text>
              <Text style={dynamicStyles.emptyStateSubtext}>
                Your messages will appear here
              </Text>
            </>
          )}
        </View>
      ) : (
        <>
          {messages.map((msg, index) => {
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
          })}
          {isPartnerTyping && <TypingIndicator />}
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },
  emptyStateText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
});

