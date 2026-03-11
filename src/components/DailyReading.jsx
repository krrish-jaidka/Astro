// src/components/DailyReading.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getDailyReading } from '../utils/astrologyData';
import './DailyReading.css';

export default function DailyReading({ sign, onBack }) {
  const [reading, setReading] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadReading() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDailyReading(sign.id);
        if (isMounted) {
          setReading(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load your reading. Please try again.");
          setIsLoading(false);
        }
      }
    }

    loadReading();

    return () => {
      isMounted = false;
    };
  }, [sign.id]);

  if (isLoading) {
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
        </div>
        <div className="loading-state fade-in-up">
          <div className="spinner"></div>
          <p>Consulting the stars...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
        </div>
        <div className="error-state fade-in-up">
          <p>{error}</p>
        </div>
      </div>
    );
  }

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

        <div className="card-insight glass-panel fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3>Personalized Focus</h3>
          <p>{reading.personalizedFocus}</p>
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

DailyReading.propTypes = {
  sign: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};
