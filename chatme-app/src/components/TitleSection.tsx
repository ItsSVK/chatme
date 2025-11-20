import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface TitleSectionProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  subtitleFadeAnim?: Animated.Value;
  variant?: 'home' | 'splash';
}

/**
 * TitleSection Component
 * Displays animated title and subtitle/tagline
 */
export default function TitleSection({
  title,
  subtitle,
  tagline,
  fadeAnim,
  slideAnim,
  subtitleFadeAnim,
  variant = 'home',
}: TitleSectionProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  if (variant === 'splash') {
    return (
      <Animated.View
        style={[
          styles.splashTitleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.appName}>{title}</Text>
        {tagline && <Text style={styles.tagline}>{tagline}</Text>}
      </Animated.View>
    );
  }

  return (
    <>
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.titleUnderline} />
      </Animated.View>

      {subtitle && (
        <Animated.View
          style={[
            styles.subtitleContainer,
            { opacity: subtitleFadeAnim || fadeAnim },
          ]}
        >
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      )}
    </>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    titleContainer: {
      alignItems: 'center',
      marginBottom: Theme.spacing.md,
    },
    title: {
      fontSize: Theme.fontSize.xxxl + 4,
      fontWeight: Theme.fontWeight.bold,
      color: Colors.text,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    titleUnderline: {
      width: 60,
      height: 4,
      backgroundColor: Colors.primary,
      borderRadius: Theme.borderRadius.sm,
      marginTop: Theme.spacing.xs,
      opacity: 0.6,
    },
    subtitleContainer: {
      paddingHorizontal: Theme.spacing.lg,
      marginBottom: Theme.spacing.xxl,
    },
    subtitle: {
      fontSize: Theme.fontSize.md + 1,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      letterSpacing: 0.2,
    },
    splashTitleContainer: {
      alignItems: 'center',
      marginTop: Theme.spacing.md,
    },
    appName: {
      fontSize: Theme.fontSize.xxxl,
      fontWeight: Theme.fontWeight.bold,
      color: Colors.text,
      letterSpacing: 1,
      marginBottom: Theme.spacing.sm,
    },
    tagline: {
      fontSize: Theme.fontSize.sm,
      color: Colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: Theme.fontWeight.light,
    },
  });

