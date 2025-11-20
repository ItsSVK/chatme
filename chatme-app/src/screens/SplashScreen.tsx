import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedColors } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import {
  AnimatedBackground,
  AnimatedLogo,
  TitleSection,
  FloatingBubbles,
  LoadingIndicator,
} from '../components';
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
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Auto transition after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim]);

  return (
    <SafeAreaView style={styles.splashContainer} edges={['top']}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
        translucent
      />

      {/* Animated background gradient effect */}
      <AnimatedBackground variant="splash" />

      {/* Floating chat bubbles */}
      <FloatingBubbles />

      {/* Main logo/icon */}
      <AnimatedLogo
        variant="splash"
        source={require('../assets/chatme_avatar.png')}
      />

      {/* App name */}
      <TitleSection
        title="ChatMe"
        tagline="Anonymous • Real-time • Secure"
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        variant="splash"
      />

      {/* Loading indicator */}
      <LoadingIndicator fadeAnim={fadeAnim} />
    </SafeAreaView>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    splashContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      position: 'relative',
      overflow: 'hidden',
    },
  });
