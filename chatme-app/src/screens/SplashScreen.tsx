import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import type { SplashScreenProps } from '../types';

/**
 * SplashScreen Component
 * Displays animated splash screen with logo and branding
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const Colors = useThemedColors();
  const { theme } = useTheme();
  const styles = createStyles(Colors);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bubble1Anim = useRef(new Animated.Value(0)).current;
  const bubble2Anim = useRef(new Animated.Value(0)).current;
  const bubble3Anim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const dot1Anim = useRef(new Animated.Value(0.5)).current;
  const dot2Anim = useRef(new Animated.Value(0.5)).current;
  const dot3Anim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Main logo animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
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

    // Pulsing/breathing animation for logo
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

    // Glow/shimmer animation
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

    // Floating bubbles animation
    const animateBubbles = () => {
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
    };

    animateBubbles();

    // Pulsing loading dots animation
    const animateDots = () => {
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
    };

    animateDots();

    // Auto transition after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

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
    <SafeAreaView style={styles.splashContainer} edges={['top']}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
        translucent
      />
      {/* Animated background gradient effect */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientCircle, styles.circle1]} />
        <View style={[styles.gradientCircle, styles.circle2]} />
        <View style={[styles.gradientCircle, styles.circle3]} />
      </View>

      {/* Floating chat bubbles */}
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

      {/* Main logo/icon */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
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
            <Image
              source={require('../assets/chatme_avatar.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </Animated.View>

      {/* App name */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.appName}>ChatMe</Text>
        <Text style={styles.tagline}>Anonymous • Real-time • Secure</Text>
      </Animated.View>

      {/* Loading indicator */}
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
    </SafeAreaView>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: Theme.borderRadius.full,
    opacity: 0.15,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.gradientCircle1,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.gradientCircle2,
    bottom: -80,
    left: -80,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: Colors.gradientCircle3,
    top: '40%',
    left: '50%',
  },
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
  logoContainer: {
    marginBottom: Theme.spacing.xl,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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
  logoImage: {
    width: 80,
    height: 80,
  },
  titleContainer: {
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
