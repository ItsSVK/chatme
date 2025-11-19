/**
 * EmojiPicker Component
 * Quick emoji picker with categorized sections
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, Theme, FLIRTING_EMOJIS, GAMING_EMOJIS, EMOTION_EMOJIS } from '../constants';

interface EmojiPickerProps {
  visible: boolean;
  onSelect: (emoji: string) => void;
  animationValue: Animated.Value;
}

export default function EmojiPicker({
  visible,
  onSelect,
  animationValue,
}: EmojiPickerProps) {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Quick Emojis</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Flirting Emojis Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flirting</Text>
          <View style={styles.grid}>
            {FLIRTING_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`flirting-${index}`}
                style={styles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gaming Emojis Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gaming</Text>
          <View style={styles.grid}>
            {GAMING_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`gaming-${index}`}
                style={styles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emotion Emojis Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emotions</Text>
          <View style={styles.grid}>
            {EMOTION_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`emotion-${index}`}
                style={styles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    maxHeight: 300,
    ...Theme.shadow.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textDark,
  },
  scroll: {
    maxHeight: 250,
  },
  content: {
    padding: Theme.spacing.sm,
    paddingBottom: Theme.spacing.md,
  },
  section: {
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textGray,
    marginBottom: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emojiItem: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xs,
  },
  emojiText: {
    fontSize: 28,
  },
});

