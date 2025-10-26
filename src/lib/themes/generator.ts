// src/lib/themes/generator.ts

import { Theme, ThemeColors, ThemeMode, BackgroundStyle, CustomThemeInput } from '@/types/theme';
import { lightenColor, darkenColor, getContrastColor } from './utils';

/**
 * Generate a complete theme from a primary color
 */
export function generateThemeFromPrimary(input: CustomThemeInput): Theme {
  const { primaryColor, accentColor, mode, backgroundStyle } = input;

  const colors = generateColorPalette(primaryColor, accentColor, mode, backgroundStyle);

  return {
    id: 'custom',
    name: 'Custom Theme',
    description: 'Your personalized color theme',
    mode,
    backgroundStyle,
    colors,
    isCustom: true,
    preview: {
      primary: primaryColor,
      accent: accentColor,
      background: colors.bgPrimary,
    },
  };
}

/**
 * Generate complete color palette from primary and accent colors
 */
function generateColorPalette(
  primary: string,
  accent: string,
  mode: ThemeMode,
  backgroundStyle: BackgroundStyle
): ThemeColors {
  const isLight = mode === 'light';

  // Generate primary color variations
  const primaryDark = darkenColor(primary, 10);
  const primaryLight = lightenColor(primary, 20);
  const primaryHover = darkenColor(primary, 15);

  // Generate accent color variations
  const accentDark = darkenColor(accent, 10);
  const accentLight = lightenColor(accent, 20);
  const accentHover = darkenColor(accent, 10);

  // Semantic colors (can be customized based on accent)
  const success = accent; // Use accent as success color
  const warning = '#f59e0b';
  const error = '#ef4444';
  const danger = '#ef4444';
  const info = lightenColor(primary, 10);

  // Generate background colors based on mode and style
  let bgPrimary, bgSecondary, bgTertiary, backgroundCard, backgroundLight;

  if (isLight) {
    switch (backgroundStyle) {
      case 'warm':
        bgPrimary = '#fefdfb';
        bgSecondary = '#faf8f5';
        bgTertiary = '#f5f2ed';
        break;
      case 'cool':
        bgPrimary = '#fbfcfd';
        bgSecondary = '#f6f8fa';
        bgTertiary = '#f0f3f6';
        break;
      default: // clean
        bgPrimary = '#ffffff';
        bgSecondary = '#f9fafb';
        bgTertiary = '#f3f4f6';
    }
    backgroundCard = '#ffffff';
    backgroundLight = bgSecondary;
  } else {
    // Dark mode
    switch (backgroundStyle) {
      case 'warm':
        bgPrimary = '#1a1816';
        bgSecondary = '#252220';
        bgTertiary = '#2f2b28';
        break;
      case 'cool':
        bgPrimary = '#161a1d';
        bgSecondary = '#1f2428';
        bgTertiary = '#282e33';
        break;
      default: // clean
        bgPrimary = '#111827';
        bgSecondary = '#1f2937';
        bgTertiary = '#374151';
    }
    backgroundCard = bgSecondary;
    backgroundLight = bgTertiary;
  }

  // Generate text colors based on mode
  const textPrimary = isLight ? '#111827' : '#f9fafb';
  const textSecondary = isLight ? '#6b7280' : '#9ca3af';
  const textTertiary = isLight ? '#9ca3af' : '#6b7280';
  const textInverse = isLight ? '#ffffff' : '#111827';
  const textDark = isLight ? '#1f2937' : '#f3f4f6';
  const textMedium = isLight ? '#4b5563' : '#d1d5db';
  const textLight = isLight ? '#6b7280' : '#9ca3af';

  // Generate border colors based on mode
  const borderLight = isLight ? '#e5e7eb' : '#374151';
  const borderMedium = isLight ? '#d1d5db' : '#4b5563';
  const borderDark = isLight ? '#9ca3af' : '#6b7280';
  const borderColor = borderLight;

  // Generate gray scale based on mode
  const gray50 = isLight ? '#f9fafb' : '#1f2937';
  const gray100 = isLight ? '#f3f4f6' : '#374151';
  const gray200 = isLight ? '#e5e7eb' : '#4b5563';
  const gray300 = isLight ? '#d1d5db' : '#6b7280';
  const gray400 = isLight ? '#9ca3af' : '#9ca3af';
  const gray500 = isLight ? '#6b7280' : '#d1d5db';
  const gray600 = isLight ? '#4b5563' : '#e5e7eb';
  const gray700 = isLight ? '#374151' : '#f3f4f6';
  const gray800 = isLight ? '#1f2937' : '#f9fafb';
  const gray900 = isLight ? '#111827' : '#ffffff';

  return {
    primary,
    primaryDark,
    primaryLight,
    primaryHover,
    accent,
    accentDark,
    accentLight,
    accentHover,
    success,
    warning,
    error,
    danger,
    info,
    bgPrimary,
    bgSecondary,
    bgTertiary,
    bgOverlay: 'rgba(0, 0, 0, 0.5)',
    backgroundCard,
    backgroundLight,
    textPrimary,
    textSecondary,
    textTertiary,
    textInverse,
    textDark,
    textMedium,
    textLight,
    borderLight,
    borderMedium,
    borderDark,
    borderColor,
    gray50,
    gray100,
    gray200,
    gray300,
    gray400,
    gray500,
    gray600,
    gray700,
    gray800,
    gray900,
  };
}

