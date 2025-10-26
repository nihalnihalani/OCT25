// src/contexts/ThemeContext.tsx

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, CustomThemeInput } from '@/types/theme';
import { useTheme as useThemeHook } from '@/hooks/useTheme';

interface ThemeContextType {
  currentTheme: Theme;
  isLoading: boolean;
  presetThemes: Theme[];
  applyTheme: (theme: Theme) => void;
  createCustomTheme: (input: CustomThemeInput) => Theme;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeHook();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

