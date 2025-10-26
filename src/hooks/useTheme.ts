// src/hooks/useTheme.ts

import { useState, useEffect, useCallback } from 'react';
import { Theme, ThemePreferences, CustomThemeInput } from '@/types/theme';
import { presetThemes, getDefaultTheme } from '@/lib/themes/presets';
import { generateThemeFromPrimary } from '@/lib/themes/generator';
import { applyThemeToDocument } from '@/lib/themes/utils';

const THEME_STORAGE_KEY = 'bud-dy-theme-preferences';

/**
 * Custom hook for theme management
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getDefaultTheme());
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (currentTheme && !isLoading) {
      applyThemeToDocument(currentTheme);
    }
  }, [currentTheme, isLoading]);

  /**
   * Load theme from localStorage
   */
  const loadThemeFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const preferences: ThemePreferences = JSON.parse(stored);
        
        // If custom theme, use it
        if (preferences.customTheme) {
          setCurrentTheme(preferences.customTheme);
        } else {
          // Find preset theme
          const preset = presetThemes.find((t) => t.id === preferences.themeId);
          if (preset) {
            setCurrentTheme(preset);
          }
        }
      }
    } catch (error) {
      console.error('Error loading theme from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save theme to localStorage
   */
  const saveThemeToStorage = useCallback((theme: Theme) => {
    try {
      const preferences: ThemePreferences = {
        themeId: theme.id,
        customTheme: theme.isCustom ? theme : undefined,
        lastUpdated: new Date(),
      };
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
  }, []);

  /**
   * Apply a preset or custom theme
   */
  const applyTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    saveThemeToStorage(theme);
  }, [saveThemeToStorage]);

  /**
   * Create and apply a custom theme
   */
  const createCustomTheme = useCallback((input: CustomThemeInput) => {
    const customTheme = generateThemeFromPrimary(input);
    applyTheme(customTheme);
    return customTheme;
  }, [applyTheme]);

  /**
   * Reset to default theme
   */
  const resetToDefault = useCallback(() => {
    const defaultTheme = getDefaultTheme();
    applyTheme(defaultTheme);
  }, [applyTheme]);

  /**
   * Get all available preset themes
   */
  const getPresetThemes = useCallback(() => {
    return presetThemes;
  }, []);

  return {
    currentTheme,
    isLoading,
    presetThemes: getPresetThemes(),
    applyTheme,
    createCustomTheme,
    resetToDefault,
  };
}

