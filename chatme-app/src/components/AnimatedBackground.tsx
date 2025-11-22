import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  variant?: 'home' | 'splash';
}

/**
 * AnimatedBackground Component
 * Displays animated gradient circles and floating particles
 */
export default function AnimatedBackground({ variant = 'home' }: AnimatedBackgroundProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);

  // Gradient animations
  const gradient1Anim = useRef(new Animated.Value(0)).current;
  const gradient2Anim = useRef(new Animated.Value(0)).current;
  const gradient3Anim = useRef(new Animated.Value(0)).current;

  // Floating particles (for home variant)
  const particle1Anim = useRef(new Animated.Value(0)).current;
  const particle2Anim = useRef(new Animated.Value(0)).current;
  const particle3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    // Floating particles (only for home variant)
    if (variant === 'home') {
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
    }
  }, [variant]);

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

  if (variant === 'splash') {
    return (
      <View style={styles.backgroundContainer}>
        <View style={[styles.gradientCircle, styles.splashCircle1]} />
        <View style={[styles.gradientCircle, styles.splashCircle2]} />
        <View style={[styles.gradientCircle, styles.splashCircle3]} />
      </View>
    );
  }

  return (
    <>
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
    </>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
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
      opacity: 0.15,
    },
    gradientCircle1: {
      width: width * 1.2,
      height: width * 1.2,
      backgroundColor: Colors.gradientCircle1,
      top: -width * 0.3,
      right: -width * 0.3,
    },
    gradientCircle2: {
      width: width * 1.0,
      height: width * 1.0,
      backgroundColor: Colors.gradientCircle2,
      bottom: -width * 0.25,
      left: -width * 0.25,
    },
    gradientCircle3: {
      width: width * 0.8,
      height: width * 0.8,
      backgroundColor: Colors.gradientCircle3,
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
    // Splash variant styles
    splashCircle1: {
      width: 300,
      height: 300,
      backgroundColor: Colors.gradientCircle1,
      top: -100,
      right: -100,
    },
    splashCircle2: {
      width: 250,
      height: 250,
      backgroundColor: Colors.gradientCircle2,
      bottom: -80,
      left: -80,
    },
    splashCircle3: {
      width: 200,
      height: 200,
      backgroundColor: Colors.gradientCircle3,
      top: '40%',
      left: '50%',
    },
  });

