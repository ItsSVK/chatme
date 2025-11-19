/**
 * ChatActions Component
 * Bottom action buttons (End Chat, Next)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';
import type { ConnectionState } from '../types/websocket';

interface ChatActionsProps {
  onEndChat: () => void;
  onNextChat: () => void;
  connectionState: ConnectionState;
  visible: boolean;
}

export default function ChatActions({
  onEndChat,
  onNextChat,
  connectionState,
  visible,
}: ChatActionsProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onEndChat}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>End Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={onNextChat}
        activeOpacity={0.7}
        disabled={connectionState !== 'matched'}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: Colors.white,
  },
  button: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xs,
  },
  nextButton: {
    backgroundColor: '#DBEAFE',
  },
  buttonText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
  },
});

