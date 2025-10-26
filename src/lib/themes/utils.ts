// src/lib/themes/utils.ts

import { Theme, ThemeColors } from '@/types/theme';

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amount = Math.round(2.55 * percent);

  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amount = Math.round(2.55 * percent);

  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

/**
 * Calculate relative luminance of a color
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get appropriate text color (black or white) for a background
 */
export function getContrastColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');

  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Validate if theme meets WCAG AA standards (4.5:1 for normal text)
 */
export function validateThemeAccessibility(theme: Theme): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check primary color against white background
  const primaryContrast = getContrastRatio(theme.colors.primary, theme.colors.bgPrimary);
  if (primaryContrast < 4.5) {
    issues.push(`Primary color contrast ratio (${primaryContrast.toFixed(2)}) is below 4.5:1`);
  }

  // Check text colors against backgrounds
  const textContrast = getContrastRatio(theme.colors.textPrimary, theme.colors.bgPrimary);
  if (textContrast < 4.5) {
    issues.push(`Text contrast ratio (${textContrast.toFixed(2)}) is below 4.5:1`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Interpolate between two colors
 */
export function interpolateColors(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

  return rgbToHex(r, g, b);
}

/**
 * Apply theme to document by setting CSS variables
 */
export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement;
  const colors = theme.colors;

  // Set data attribute for theme-specific CSS
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-mode', theme.mode);

  // Apply all color variables
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--primary-dark', colors.primaryDark);
  root.style.setProperty('--primary-light', colors.primaryLight);
  root.style.setProperty('--primary-hover', colors.primaryHover);

  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--accent-dark', colors.accentDark);
  root.style.setProperty('--accent-light', colors.accentLight);
  root.style.setProperty('--accent-hover', colors.accentHover);

  root.style.setProperty('--success-color', colors.success);
  root.style.setProperty('--warning-color', colors.warning);
  root.style.setProperty('--error-color', colors.error);
  root.style.setProperty('--danger-color', colors.danger);
  root.style.setProperty('--info-color', colors.info);

  root.style.setProperty('--bg-primary', colors.bgPrimary);
  root.style.setProperty('--bg-secondary', colors.bgSecondary);
  root.style.setProperty('--bg-tertiary', colors.bgTertiary);
  root.style.setProperty('--bg-overlay', colors.bgOverlay);
  root.style.setProperty('--background-card', colors.backgroundCard);
  root.style.setProperty('--background-light', colors.backgroundLight);

  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  root.style.setProperty('--text-tertiary', colors.textTertiary);
  root.style.setProperty('--text-inverse', colors.textInverse);
  root.style.setProperty('--text-dark', colors.textDark);
  root.style.setProperty('--text-medium', colors.textMedium);
  root.style.setProperty('--text-light', colors.textLight);

  root.style.setProperty('--border-light', colors.borderLight);
  root.style.setProperty('--border-medium', colors.borderMedium);
  root.style.setProperty('--border-dark', colors.borderDark);
  root.style.setProperty('--border-color', colors.borderColor);

  root.style.setProperty('--gray-50', colors.gray50);
  root.style.setProperty('--gray-100', colors.gray100);
  root.style.setProperty('--gray-200', colors.gray200);
  root.style.setProperty('--gray-300', colors.gray300);
  root.style.setProperty('--gray-400', colors.gray400);
  root.style.setProperty('--gray-500', colors.gray500);
  root.style.setProperty('--gray-600', colors.gray600);
  root.style.setProperty('--gray-700', colors.gray700);
  root.style.setProperty('--gray-800', colors.gray800);
  root.style.setProperty('--gray-900', colors.gray900);
}

/**
 * Get system color scheme preference
 */
export function getSystemColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

