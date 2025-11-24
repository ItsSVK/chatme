/**
 * TypingIndicator Component
 * Minimalist animated typing indicator for React Native
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

export default function TypingIndicator() {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);

  // Create animated values for each dot
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const containerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation for container
    Animated.spring(containerAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Create elegant wave animation for each dot
    const createWaveAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Start animations with staggered delays for wave effect
    const animation1 = createWaveAnimation(dot1Anim, 0);
    const animation2 = createWaveAnimation(dot2Anim, 200);
    const animation3 = createWaveAnimation(dot3Anim, 400);

    animation1.start();
    animation2.start();
    animation3.start();

    // Cleanup
    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim, containerAnim]);

  // Interpolate animated values for smooth wave motion
  const createDotStyle = (animValue: Animated.Value) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1.1],
        }),
      },
    ],
  });

  const containerStyle = {
    opacity: containerAnim,
    transform: [
      {
        translateY: containerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
      {
        scale: containerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[dynamicStyles.container, containerStyle]}>
      <View style={dynamicStyles.dotsContainer}>
        <Animated.View
          style={[dynamicStyles.dot, createDotStyle(dot1Anim)]}
        />
        <Animated.View
          style={[dynamicStyles.dot, createDotStyle(dot2Anim)]}
        />
        <Animated.View
          style={[dynamicStyles.dot, createDotStyle(dot3Anim)]}
        />
      </View>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingHorizontal: Theme.spacing.md,
      paddingVertical: Theme.spacing.xs,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 20,
      paddingVertical: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.textSecondary,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
  });
