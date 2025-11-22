/**
 * ThemeToggle Component
 * Toggle button for switching between light and dark themes
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks';
import { Theme } from '../constants';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Colors = useThemedColors();

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        {
          backgroundColor: Colors.glassBackground,
          borderColor: Colors.glassBorder,
        },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
      </View>
      <Text style={[styles.toggleText, { color: Colors.text }]}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    gap: Theme.spacing.xs,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  toggleText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
  },
});

