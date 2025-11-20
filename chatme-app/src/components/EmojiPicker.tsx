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
import { Theme, FLIRTING_EMOJIS, GAMING_EMOJIS, EMOTION_EMOJIS } from '../constants';
import { useThemedColors } from '../hooks';

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
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        dynamicStyles.container,
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
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>Quick Emojis</Text>
      </View>
      <ScrollView
        style={dynamicStyles.scroll}
        contentContainerStyle={dynamicStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Flirting Emojis Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Flirting</Text>
          <View style={dynamicStyles.grid}>
            {FLIRTING_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`flirting-${index}`}
                style={dynamicStyles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={dynamicStyles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gaming Emojis Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Gaming</Text>
          <View style={dynamicStyles.grid}>
            {GAMING_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`gaming-${index}`}
                style={dynamicStyles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={dynamicStyles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emotion Emojis Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Emotions</Text>
          <View style={dynamicStyles.grid}>
            {EMOTION_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`emotion-${index}`}
                style={dynamicStyles.emojiItem}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={dynamicStyles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
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
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
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
    color: Colors.textSecondary,
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

