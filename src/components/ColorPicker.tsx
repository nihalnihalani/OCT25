// src/components/ColorPicker.tsx

'use client';

import React, { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [colorInput, setColorInput] = useState(value);

  const handleColorChange = (newColor: string) => {
    setColorInput(newColor);
    onChange(newColor);
  };

  const presetColors = [
    '#6366f1', '#f97316', '#059669', '#a855f7', '#ef4444',
    '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
    '#14b8a6', '#f43f5e', '#6366f1', '#84cc16', '#0ea5e9'
  ];

  return (
    <div className="color-picker-container">
      <label className="color-picker-label">{label}</label>
      <div className="color-picker-input-group">
        <div className="color-preview" style={{ backgroundColor: value }} />
        <input
          type="text"
          className="color-picker-input"
          value={colorInput}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
        <input
          type="color"
          className="color-picker-native"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      </div>
      <div className="preset-colors">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            className="preset-color-btn"
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
