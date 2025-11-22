/**
 * Themed Color Constants
 * Provides colors based on current theme
 */

export const lightColors = {
  // Primary colors
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  // Secondary colors
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',

  // Accent colors
  accent: '#EC4899',
  accentDark: '#DB2777',
  accentLight: '#F472B6',

  // Background colors
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#E5E5E5',

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textDark: '#1A1A1A',
  textGray: '#666666',

  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Glassmorphism (for dark elements on light background)
  glassBackground: 'rgba(0, 0, 0, 0.05)',
  glassBorder: 'rgba(0, 0, 0, 0.1)',
  glassBorderLight: 'rgba(0, 0, 0, 0.15)',

  // Gradient circles
  gradientCircle1: '#6366F1',
  gradientCircle2: '#8B5CF6',
  gradientCircle3: '#EC4899',
} as const;

export const darkColors = {
  // Primary colors
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  // Secondary colors
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',

  // Accent colors
  accent: '#EC4899',
  accentDark: '#DB2777',
  accentLight: '#F472B6',

  // Background colors
  background: '#0A0E27',
  backgroundLight: '#1A1F3A',
  backgroundDark: '#000000',

  // Text colors
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDark: '#FFFFFF',
  textGray: 'rgba(255, 255, 255, 0.5)',

  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Glassmorphism
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBorderLight: 'rgba(255, 255, 255, 0.3)',

  // Gradient circles
  gradientCircle1: '#6366F1',
  gradientCircle2: '#8B5CF6',
  gradientCircle3: '#EC4899',
} as const;

export type ColorScheme = typeof lightColors;

