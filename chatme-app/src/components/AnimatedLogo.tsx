import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

interface AnimatedLogoProps {
  variant?: 'home' | 'splash';
  source: any;
}

/**
 * AnimatedLogo Component
 * Displays animated logo with fade, scale, rotate, and float animations (home)
 * or pulse and glow animations (splash)
 */
export default function AnimatedLogo({ variant = 'home', source }: AnimatedLogoProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  // Logo animations
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const logoFloatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(variant === 'home' ? 0 : 50)).current;

  useEffect(() => {
    if (variant === 'home') {
      // Home variant animations
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloatAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoFloatAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // Splash variant animations
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [variant]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const logoFloatY = logoFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  if (variant === 'splash') {
    return (
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoFadeAnim,
            transform: [{ scale: logoScaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        {/* Animated glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Image source={source} style={styles.splashLogoImage} resizeMode="contain" />
          </View>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: logoFadeAnim,
          transform: [
            { scale: logoScaleAnim },
            { rotate: logoRotation },
            { translateY: logoFloatY },
          ],
        },
      ]}
    >
      <View style={styles.logoGlow} />
      <Image source={source} style={styles.logoImage} resizeMode="contain" />
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Theme.spacing.xl,
      position: 'relative',
    },
    logoGlow: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: Colors.primary,
      opacity: 0.1,
      top: -20,
      left: -20,
    },
    logoImage: {
      width: 140,
      height: 140,
      zIndex: 1,
    },
    glowRing: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 3,
      borderColor: Colors.primary,
      opacity: 0.3,
    },
    logoCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors.glassBackground,
      borderWidth: 2,
      borderColor: Colors.glassBorderLight,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      elevation: 10,
      overflow: 'hidden',
    },
    splashLogoImage: {
      width: 80,
      height: 80,
    },
  });

