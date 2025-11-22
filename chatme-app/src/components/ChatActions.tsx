/**
 * ChatActions Component
 * Bottom action buttons (End Chat, Next)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
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
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  if (!visible) return null;

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={onEndChat}
        activeOpacity={0.7}
      >
        <Text style={dynamicStyles.buttonText}>End Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[dynamicStyles.button, dynamicStyles.nextButton]}
        onPress={onNextChat}
        activeOpacity={0.7}
        disabled={connectionState !== 'matched'}
      >
        <Text style={dynamicStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.lg, // Added bottom padding for better spacing
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    backgroundColor: Colors.background,
  },
  button: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xs,
  },
  nextButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  buttonText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
  },
});

