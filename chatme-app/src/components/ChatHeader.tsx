/**
 * ChatHeader Component
 * Header showing contact avatar, name, and status
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface ChatHeaderProps {
  contactName: string;
  contactStatus: string;
}

export default function ChatHeader({
  contactName,
  contactStatus,
}: ChatHeaderProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  return (
    <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerCenter}>
        <View style={dynamicStyles.avatarContainer}>
          <View style={dynamicStyles.avatar}>
            <Image
              source={require('../assets/chatme_avatar.png')}
              style={dynamicStyles.avatar}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={dynamicStyles.headerInfo}>
          <Text style={dynamicStyles.contactName}>{contactName}</Text>
          <Text style={dynamicStyles.contactStatus}>{contactStatus}</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    ...Theme.shadow.small,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

