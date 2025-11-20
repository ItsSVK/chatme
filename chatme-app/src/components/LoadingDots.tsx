/**
 * LoadingDots Component
 * Animated loading dots indicator
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface LoadingDotsProps {
  isAnimating?: boolean;
}

export default function LoadingDots({ isAnimating = true }: LoadingDotsProps) {
  const Colors = useThemedColors();
  const dynamicStyles = createStyles(Colors);
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isAnimating) return;

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
            toValue: 0.3,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animation = Animated.parallel([
      createPulse(dot1Anim, 0),
      createPulse(dot2Anim, 200),
      createPulse(dot3Anim, 400),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isAnimating, dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={dynamicStyles.container}>
      <Animated.View
        style={[
          dynamicStyles.dot,
          {
            opacity: dot1Anim,
            transform: [{ scale: dot1Anim }],
          },
        ]}
      />
      <Animated.View
        style={[
          dynamicStyles.dot,
          {
            opacity: dot2Anim,
            transform: [{ scale: dot2Anim }],
          },
        ]}
      />
      <Animated.View
        style={[
          dynamicStyles.dot,
          {
            opacity: dot3Anim,
            transform: [{ scale: dot3Anim }],
          },
        ]}
      />
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginHorizontal: Theme.spacing.xs,
  },
});
