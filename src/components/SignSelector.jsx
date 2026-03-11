// src/components/SignSelector.jsx
import React from 'react';
import { ZODIAC_SIGNS } from '../utils/astrologyData';
import './SignSelector.css';

export default function SignSelector({ onSelect }) {
  return (
    <div className="sign-selector-container scale-in">
      <div className="grid">
        {ZODIAC_SIGNS.map((sign, index) => (
          <div 
            key={sign.id} 
            className="sign-card glass-panel" 
            onClick={() => onSelect(sign)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="sign-icon">{sign.icon}</div>
            <h3 className="sign-name">{sign.name}</h3>
            <p className="sign-dates">{sign.dateRange}</p>
            <div className="glow-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
