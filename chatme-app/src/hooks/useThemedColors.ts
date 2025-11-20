/**
 * useThemedColors Hook
 * Returns color scheme based on current theme
 */

import { useTheme } from '../contexts/ThemeContext';
import { lightColors, darkColors, type ColorScheme } from '../constants/themedColors';

export function useThemedColors(): ColorScheme {
  const { theme } = useTheme();
  return theme === 'dark' ? darkColors : lightColors;
}

