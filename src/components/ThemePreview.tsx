// src/components/ThemePreview.tsx

'use client';

import React from 'react';
import { Theme } from '@/types/theme';

interface ThemePreviewProps {
  theme: Theme;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const colors = theme.colors;

  return (
    <div className="theme-preview-container">
      <h3 className="preview-title">Live Preview</h3>
      <div className="preview-window">
        <div className="preview-sample">
          <div className="sample-button primary" style={{ backgroundColor: colors.primary }}>
            Primary Button
          </div>
          <div className="sample-button accent" style={{ backgroundColor: colors.accent }}>
            Accent Button
          </div>
          <div className="sample-button secondary" style={{ 
            border: `2px solid ${colors.primary}`,
            color: colors.primary
          }}>
            Secondary Button
          </div>
        </div>
        
        <div className="sample-card" style={{ backgroundColor: colors.backgroundCard }}>
          <div className="card-title" style={{ color: colors.textPrimary }}>
            Sample Card
          </div>
          <div className="card-text" style={{ color: colors.textSecondary }}>
            This is how your content will look with this theme.
          </div>
        </div>

        <div className="sample-message user" style={{ backgroundColor: colors.primary, color: colors.textInverse }}>
          <div className="message-content">User message example</div>
        </div>
        
        <div className="sample-message assistant" style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary }}>
          <div className="message-content">Assistant response example</div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
