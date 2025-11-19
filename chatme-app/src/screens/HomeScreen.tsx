import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Theme } from '../constants';
import type { HomeScreenProps } from '../types';

const { width, height } = Dimensions.get('window');

/**
 * HomeScreen Component
 * Modern, aesthetic home screen with glassmorphism, gradients, and smooth animations
 */
export default function HomeScreen({ onStartChat }: HomeScreenProps) {
  // Logo animations
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const logoFloatAnim = useRef(new Animated.Value(0)).current;

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
  const buttonShineAnim = useRef(new Animated.Value(0)).current;

  // Background gradient animations
  const gradient1Anim = useRef(new Animated.Value(0)).current;
  const gradient2Anim = useRef(new Animated.Value(0)).current;
  const gradient3Anim = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1Anim = useRef(new Animated.Value(0)).current;
  const particle2Anim = useRef(new Animated.Value(0)).current;
  const particle3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    const animations = [
      // Logo entrance
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
      ]),
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

    // Continuous floating animation for logo
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

    // Animated gradient backgrounds
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(gradient1Anim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(gradient1Anim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(gradient2Anim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(gradient2Anim, {
            toValue: 0,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(gradient3Anim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(gradient3Anim, {
            toValue: 0,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();

    // Floating particles
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(particle1Anim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle1Anim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particle2Anim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle2Anim, {
            toValue: 0,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particle3Anim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle3Anim, {
            toValue: 0,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(buttonScaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.timing(buttonShineAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(buttonShineAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Interpolated values
  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const logoFloatY = logoFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const gradient1Opacity = gradient1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.25],
  });

  const gradient2Opacity = gradient2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.22],
  });

  const gradient3Opacity = gradient3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  const particle1Y = particle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const particle2Y = particle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const particle3Y = particle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const buttonShineTranslateX = buttonShineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.backgroundLight}
      />

      {/* Animated gradient background */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.gradientCircle,
            styles.gradientCircle1,
            { opacity: gradient1Opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientCircle,
            styles.gradientCircle2,
            { opacity: gradient2Opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientCircle,
            styles.gradientCircle3,
            { opacity: gradient3Opacity },
          ]}
        />
      </View>

      {/* Floating particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { transform: [{ translateY: particle1Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { transform: [{ translateY: particle3Y }] },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo with animations */}
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
          <Image
            source={require('../assets/chatme.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleFadeAnim,
              transform: [{ translateY: titleSlideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Ready to Chat?</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={[styles.subtitleContainer, { opacity: subtitleFadeAnim }]}
        >
          <Text style={styles.subtitle}>
            Connect anonymously with people around the world
          </Text>
        </Animated.View>

        {/* Feature cards with glassmorphism */}
        <View style={styles.featuresContainer}>
          <Animated.View
            style={[
              styles.featureCard,
              {
                opacity: feature1Anim,
                transform: [
                  {
                    translateY: feature1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🔒</Text>
            </View>
            <Text style={styles.featureTitle}>Anonymous</Text>
            <Text style={styles.featureDescription}>
              Your privacy is protected
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.featureCard,
              {
                opacity: feature2Anim,
                transform: [
                  {
                    translateY: feature2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>⚡</Text>
            </View>
            <Text style={styles.featureTitle}>Real-time</Text>
            <Text style={styles.featureDescription}>
              Instant messaging experience
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.featureCard,
              {
                opacity: feature3Anim,
                transform: [
                  {
                    translateY: feature3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🌍</Text>
            </View>
            <Text style={styles.featureTitle}>Global</Text>
            <Text style={styles.featureDescription}>
              Chat with anyone, anywhere
            </Text>
          </Animated.View>
        </View>

        {/* Start Button with gradient and shine effect */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonFadeAnim,
              transform: [{ scale: buttonScaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartChat}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            {/* Gradient overlay */}
            <View style={styles.buttonGradient} />

            {/* Shine effect */}
            <Animated.View
              style={[
                styles.buttonShine,
                {
                  transform: [{ translateX: buttonShineTranslateX }],
                },
              ]}
            />

            <Text style={styles.startButtonText}>Start Chatting</Text>
            {/* <View style={styles.startButtonIconContainer}>
              <Text style={styles.startButtonIcon}>→</Text>
            </View> */}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: Theme.borderRadius.full,
  },
  gradientCircle1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: Colors.primary,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  gradientCircle2: {
    width: width * 1.0,
    height: width * 1.0,
    backgroundColor: Colors.secondary,
    bottom: -width * 0.25,
    left: -width * 0.25,
  },
  gradientCircle3: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: Colors.accent,
    top: height * 0.3,
    left: width * 0.1,
  },
  particle: {
    position: 'absolute',
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary,
    opacity: 0.15,
  },
  particle1: {
    width: 60,
    height: 60,
    top: height * 0.15,
    left: width * 0.2,
  },
  particle2: {
    width: 40,
    height: 40,
    top: height * 0.7,
    right: width * 0.15,
  },
  particle3: {
    width: 50,
    height: 50,
    top: height * 0.5,
    left: width * 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    zIndex: 1,
  },
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxxl + 4,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textDark,
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
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Theme.spacing.xxl + Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#EDE9FE',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    marginHorizontal: Theme.spacing.xs,
    ...Theme.shadow.small,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: Theme.fontSize.sm + 1,
    color: Colors.textDark,
    fontWeight: Theme.fontWeight.semibold,
    marginBottom: Theme.spacing.xs / 2,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Theme.spacing.md + 4,
    paddingHorizontal: Theme.spacing.xl + Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.7,
    position: 'relative',
    overflow: 'hidden',
    ...Theme.shadow.large,
    // Gradient effect
    borderWidth: 0,
  },
  buttonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primaryDark,
    opacity: 0,
  },
  buttonShine: {
    position: 'absolute',
    width: 100,
    height: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ rotate: '25deg' }],
    top: -50,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: Theme.fontSize.lg + 2,
    fontWeight: Theme.fontWeight.bold,
    marginRight: Theme.spacing.sm,
    letterSpacing: 0.5,
    zIndex: 1,
  },
  startButtonIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  startButtonIcon: {
    color: Colors.white,
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
  },
});
