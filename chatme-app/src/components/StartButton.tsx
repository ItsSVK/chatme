import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Theme } from '../constants';
import { useThemedColors } from '../hooks';

const { width } = Dimensions.get('window');

interface StartButtonProps {
  onPress: () => void;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

/**
 * StartButton Component
 * Animated button with gradient and shine effect
 */
export default function StartButton({
  onPress,
  fadeAnim,
  scaleAnim,
}: StartButtonProps) {
  const Colors = useThemedColors();
  const styles = createStyles(Colors);
  const buttonShineAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
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
      Animated.spring(scaleAnim, {
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

  const buttonShineTranslateX = buttonShineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.startButton}
        onPress={onPress}
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
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (Colors: ReturnType<typeof useThemedColors>) =>
  StyleSheet.create({
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
  });

