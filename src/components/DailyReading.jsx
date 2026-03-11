// src/components/DailyReading.jsx
import React from 'react';
import { getDailyReading } from '../utils/astrologyData';
import './DailyReading.css';

export default function DailyReading({ sign, onBack }) {
  const reading = getDailyReading(sign.id);

  return (
    <div className="daily-reading-container">
      <button className="btn-back" onClick={onBack}>
        ← Back to signs
      </button>

      <div className="reading-header fade-in-up">
        <div className="sign-badge">
          <span className="sign-badge-icon">{sign.icon}</span>
          <span className="sign-badge-name">{sign.name}</span>
        </div>
        <h2>Daily Forecast</h2>
        <p className="date-display">{reading.date}</p>
      </div>

      <div className="reading-grid">
        <div className="card-insight glass-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3>Cosmic Insight</h3>
          <p>{reading.insight}</p>
        </div>

        <div className="stats-row">
          <div className="card-stat glass-panel fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-label">Energy Type</div>
            <div className="stat-value energy-text">{reading.energy}</div>
          </div>

          <div className="card-stat glass-panel fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-label">Lucky Number</div>
            <div className="stat-value number-text">{reading.luckyNumber}</div>
          </div>
        </div>

        <div className="card-avoid glass-panel fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="warning-icon">⚠️</div>
          <div className="avoid-content">
            <h3>What to Avoid</h3>
            <p>{reading.avoid}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
