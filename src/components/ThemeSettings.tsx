// src/components/ThemeSettings.tsx

'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemePresetCard from './ThemePresetCard';
import ThemePreview from './ThemePreview';
import ColorPicker from './ColorPicker';
import { ThemeMode, BackgroundStyle } from '@/types/theme';

const ThemeSettings: React.FC = () => {
  const { currentTheme, presetThemes, applyTheme, createCustomTheme, resetToDefault } = useTheme();
  
  const [customPrimary, setCustomPrimary] = useState('#6366f1');
  const [customAccent, setCustomAccent] = useState('#10b981');
  const [customMode, setCustomMode] = useState<ThemeMode>('light');
  const [customBackground, setCustomBackground] = useState<BackgroundStyle>('clean');

  const handlePresetClick = (theme: any) => {
    applyTheme(theme);
  };

  const handleCustomTheme = () => {
    createCustomTheme({
      primaryColor: customPrimary,
      accentColor: customAccent,
      mode: customMode,
      backgroundStyle: customBackground
    });
  };

  return (
    <div className="theme-settings-page">
      <div className="theme-settings-header">
        <h1>🎨 Customize Your Theme</h1>
        <p>Personalize BUD-DY to match your style</p>
      </div>

      {/* Preset Themes Section */}
      <section className="preset-themes-section">
        <h2>Preset Themes</h2>
        <div className="preset-themes-grid">
          {presetThemes.map((theme) => (
            <ThemePresetCard
              key={theme.id}
              theme={theme}
              isActive={currentTheme?.id === theme.id}
              onClick={() => handlePresetClick(theme)}
            />
          ))}
        </div>
      </section>

      {/* Custom Theme Builder */}
      <section className="custom-theme-section">
        <h2>Create Custom Theme</h2>
        <div className="custom-theme-builder">
          <div className="color-selectors">
            <ColorPicker
              label="Primary Color"
              value={customPrimary}
              onChange={setCustomPrimary}
            />
            <ColorPicker
              label="Accent Color"
              value={customAccent}
              onChange={setCustomAccent}
            />
          </div>

          <div className="theme-options">
            <div className="option-group">
              <label>Theme Mode</label>
              <div className="toggle-buttons">
                <button
                  className={`toggle-btn ${customMode === 'light' ? 'active' : ''}`}
                  onClick={() => setCustomMode('light')}
                >
                  ☀️ Light
                </button>
                <button
                  className={`toggle-btn ${customMode === 'dark' ? 'active' : ''}`}
                  onClick={() => setCustomMode('dark')}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            <div className="option-group">
              <label>Background Style</label>
              <select
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value as BackgroundStyle)}
                className="select-field"
              >
                <option value="clean">Clean</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={handleCustomTheme}>
            Apply Custom Theme
          </button>
        </div>
      </section>

      {/* Live Preview */}
      <section className="preview-section">
        <ThemePreview theme={currentTheme} />
      </section>

      {/* Actions */}
      <div className="theme-actions">
        <button className="btn-secondary" onClick={resetToDefault}>
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
