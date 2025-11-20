import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

/**
 * FloatingBubbles Component
 * Displays animated floating chat bubbles for splash screen
 */
export default function FloatingBubbles() {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  const bubble1Anim = useRef(new Animated.Value(0)).current;
  const bubble2Anim = useRef(new Animated.Value(0)).current;
  const bubble3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(bubble1Anim, {
          toValue: 1,
          duration: 1000,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bubble2Anim, {
          toValue: 1,
          duration: 1000,
          delay: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bubble3Anim, {
          toValue: 1,
          duration: 1000,
          delay: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const bubble1Y = bubble1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const bubble2Y = bubble2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const bubble3Y = bubble3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.chatBubble,
          styles.bubble1,
          {
            opacity: bubble1Anim,
            transform: [{ translateY: bubble1Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.chatBubble,
          styles.bubble2,
          {
            opacity: bubble2Anim,
            transform: [{ translateY: bubble2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.chatBubble,
          styles.bubble3,
          {
            opacity: bubble3Anim,
            transform: [{ translateY: bubble3Y }],
          },
        ]}
      />
    </>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    chatBubble: {
      position: 'absolute',
      borderRadius: Theme.borderRadius.xl,
      backgroundColor: Colors.glassBackground,
      borderWidth: 1,
      borderColor: Colors.glassBorder,
    },
    bubble1: {
      width: 60,
      height: 60,
      top: '20%',
      left: '15%',
    },
    bubble2: {
      width: 45,
      height: 45,
      top: '30%',
      right: '20%',
    },
    bubble3: {
      width: 50,
      height: 50,
      bottom: '25%',
      left: '25%',
    },
  });

