// src/components/ThemePresetCard.tsx

'use client';

import React from 'react';
import { Theme } from '@/types/theme';

interface ThemePresetCardProps {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}

const ThemePresetCard: React.FC<ThemePresetCardProps> = ({ theme, isActive, onClick }) => {
  const { name, description, preview } = theme;

  return (
    <div
      className={`theme-preset-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="theme-preview">
        <div
          className="theme-preview-primary"
          style={{ backgroundColor: preview?.primary || '#6366f1' }}
        />
        <div
          className="theme-preview-accent"
          style={{ backgroundColor: preview?.accent || '#10b981' }}
        />
        <div
          className="theme-preview-bg"
          style={{ backgroundColor: preview?.background || '#ffffff' }}
        />
      </div>
      <div className="theme-card-content">
        <h3 className="theme-name">{name}</h3>
        <p className="theme-description">{description}</p>
        {theme.mode === 'dark' && <span className="dark-badge">🌙 Dark Mode</span>}
      </div>
      {isActive && <div className="check-mark">✓</div>}
    </div>
  );
};

export default ThemePresetCard;
