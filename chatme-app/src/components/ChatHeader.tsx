/**
 * ChatHeader Component
 * Header showing contact avatar, name, and status
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Theme } from '../constants';

interface ChatHeaderProps {
  contactName: string;
  contactStatus: string;
}

export default function ChatHeader({
  contactName,
  contactStatus,
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCenter}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={require('../assets/chatme_avatar.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.contactStatus}>{contactStatus}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    color: Colors.textDark,
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textGray,
    fontStyle: 'italic',
  },
});

