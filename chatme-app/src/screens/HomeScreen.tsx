import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import {
  ThemeToggle,
  AnimatedBackground,
  AnimatedLogo,
  TitleSection,
  FeatureCard,
  StartButton,
} from '../components';
import type { HomeScreenProps } from '../types';

/**
 * HomeScreen Component
 * Modern, aesthetic home screen with glassmorphism, gradients, and smooth animations
 */
export default function HomeScreen({ onStartChat }: HomeScreenProps) {
  const Colors = useThemedColors();
  const { theme } = useTheme();
  const styles = createStyles(Colors);

  // Title animations
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(20)).current;

  // Subtitle animation
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  // Feature cards animations
  const feature1Anim = useRef(new Animated.Value(0)).current;
  const feature2Anim = useRef(new Animated.Value(0)).current;
  const feature3Anim = useRef(new Animated.Value(0)).current;

  // Button animations
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animations
    const animations = [
      // Title entrance
      Animated.parallel([
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 600,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Subtitle entrance
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Feature cards (staggered)
      Animated.timing(feature1Anim, {
        toValue: 1,
        duration: 500,
        delay: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(feature2Anim, {
        toValue: 1,
        duration: 500,
        delay: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(feature3Anim, {
        toValue: 1,
        duration: 500,
        delay: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Button entrance
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.parallel(animations).start();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
        translucent
      />

      {/* Theme Toggle Button */}
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      {/* Animated gradient background */}
      <AnimatedBackground variant="home" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo with animations */}
        <AnimatedLogo variant="home" source={require('../assets/chatme.png')} />

        {/* Title and Subtitle */}
        <TitleSection
          title="Ready to Chat?"
          subtitle="Connect anonymously with people around the world"
          fadeAnim={titleFadeAnim}
          slideAnim={titleSlideAnim}
          subtitleFadeAnim={subtitleFadeAnim}
          variant="home"
        />

        {/* Feature cards */}
        <View style={styles.featuresContainer}>
          <FeatureCard
            icon="🔒"
            title="Anonymous"
            description="Your privacy is protected"
            borderColor="#8B5CF6"
            iconBgColor="rgba(139, 92, 246, 0.12)"
            animationValue={feature1Anim}
          />
          <FeatureCard
            icon="⚡"
            title="Real-time"
            description="Instant messaging experience"
            borderColor="#F59E0B"
            iconBgColor="rgba(245, 158, 11, 0.12)"
            animationValue={feature2Anim}
          />
          <FeatureCard
            icon="🌍"
            title="Global"
            description="Chat with anyone, anywhere"
            borderColor="#3B82F6"
            iconBgColor="rgba(59, 130, 246, 0.12)"
            animationValue={feature3Anim}
          />
        </View>

        {/* Start Button */}
        <StartButton
          onPress={onStartChat}
          fadeAnim={buttonFadeAnim}
          scaleAnim={buttonScaleAnim}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    themeToggleContainer: {
      position: 'absolute',
      top: 50,
      right: Theme.spacing.md,
      zIndex: 10,
    },
    scrollView: {
      flex: 1,
      zIndex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Theme.spacing.xl,
      paddingTop: Theme.spacing.xxl,
      paddingBottom: Theme.spacing.xl,
      minHeight: 0, // Allow content to shrink on small screens
    },
    featuresContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: Theme.spacing.md,
      marginBottom: Theme.spacing.lg,
      paddingHorizontal: Theme.spacing.sm,
    },
  });
