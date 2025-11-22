import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface LoadingIndicatorProps {
  fadeAnim: Animated.Value;
}

/**
 * LoadingIndicator Component
 * Displays animated loading dots
 */
export default function LoadingIndicator({ fadeAnim }: LoadingIndicatorProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  const dot1Anim = useRef(new Animated.Value(0.5)).current;
  const dot2Anim = useRef(new Animated.Value(0.5)).current;
  const dot3Anim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    Animated.parallel([
      createPulse(dot1Anim, 0),
      createPulse(dot2Anim, 200),
      createPulse(dot3Anim, 400),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.loadingContainer,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.loadingDot,
          {
            opacity: dot1Anim,
            transform: [{ scale: dot1Anim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingDot,
          styles.loadingDotDelay1,
          {
            opacity: dot2Anim,
            transform: [{ scale: dot2Anim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingDot,
          styles.loadingDotDelay2,
          {
            opacity: dot3Anim,
            transform: [{ scale: dot3Anim }],
          },
        ]}
      />
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    loadingContainer: {
      flexDirection: 'row',
      marginTop: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: Colors.primary,
      marginHorizontal: Theme.spacing.xs,
    },
    loadingDotDelay1: {
      backgroundColor: Colors.secondary,
    },
    loadingDotDelay2: {
      backgroundColor: Colors.accent,
    },
  });

