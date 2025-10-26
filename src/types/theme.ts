// src/types/theme.ts

export type ThemeMode = 'light' | 'dark';
export type BackgroundStyle = 'clean' | 'warm' | 'cool';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryHover: string;

  // Accent Colors
  accent: string;
  accentDark: string;
  accentLight: string;
  accentHover: string;

  // Semantic Colors
  success: string;
  warning: string;
  error: string;
  danger: string;
  info: string;

  // Background Colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgOverlay: string;
  backgroundCard: string;
  backgroundLight: string;

  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textDark: string;
  textMedium: string;
  textLight: string;

  // Border Colors
  borderLight: string;
  borderMedium: string;
  borderDark: string;
  borderColor: string;

  // Neutral Colors
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  backgroundStyle: BackgroundStyle;
  colors: ThemeColors;
  isCustom: boolean;
  preview?: {
    primary: string;
    accent: string;
    background: string;
  };
}

export interface ThemePreferences {
  themeId: string;
  customTheme?: Theme;
  lastUpdated?: Date;
}

export interface CustomThemeInput {
  primaryColor: string;
  accentColor: string;
  mode: ThemeMode;
  backgroundStyle: BackgroundStyle;
}

