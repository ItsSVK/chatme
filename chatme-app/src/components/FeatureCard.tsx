import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  borderColor: string;
  iconBgColor: string;
  animationValue: Animated.Value;
}

/**
 * FeatureCard Component
 * Displays a single feature card with icon, title, and description
 */
export default function FeatureCard({
  icon,
  title,
  description,
  borderColor,
  iconBgColor,
  animationValue,
}: FeatureCardProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          borderTopColor: borderColor,
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.featureIconContainer,
          { backgroundColor: iconBgColor },
        ]}
      >
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    featureCard: {
      flex: 1,
      backgroundColor: Colors.glassBackground,
      borderRadius: Theme.borderRadius.xl,
      padding: Theme.spacing.md,
      alignItems: 'center',
      borderTopWidth: 4,
      marginHorizontal: Theme.spacing.xs,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 1,
    },
    featureIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Theme.spacing.md,
    },
    featureIcon: {
      fontSize: 30,
    },
    featureTitle: {
      fontSize: Theme.fontSize.sm + 1,
      color: Colors.text,
      fontWeight: Theme.fontWeight.semibold,
      marginBottom: Theme.spacing.xs / 2,
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: Theme.fontSize.xs,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

