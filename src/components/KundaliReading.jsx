// src/components/KundaliReading.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './KundaliReading.css';

export default function KundaliReading({ reading, userName, onBack }) {
  return (
    <div className="kundali-reading-container">
      <button className="btn-back-nav" onClick={onBack}>
        ← Back to Home
      </button>

      <div className="kundali-header fade-in-up">
        <span className="header-icon">🕉️</span>
        <h2>{userName}&apos;s Kundali</h2>
        <p className="kundali-subtitle">Your Vedic Birth Chart & Cosmic Blueprint</p>
      </div>

      <div className="kundali-grid">
        {/* Sun, Moon, Ascendant */}
        <div className="sign-info-row">
          <div className="sign-info-card glass-panel fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-label">☀️ Sun Sign</div>
            <div className="card-value">{reading.sunSign}</div>
          </div>
          <div className="sign-info-card glass-panel fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="card-label">🌙 Moon Sign</div>
            <div className="card-value">{reading.moonSign}</div>
          </div>
          <div className="sign-info-card glass-panel fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-label">⬆️ Ascendant</div>
            <div className="card-value">{reading.ascendant}</div>
          </div>
        </div>

        {/* Planetary Positions */}
        <div className="kundali-section-card glass-panel fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h3>🪐 Planetary Positions</h3>
          <div className="planets-grid">
            {reading.planets && reading.planets.map((planet, i) => (
              <div className="planet-chip" key={i}>
                <span className="planet-name">{planet.name}</span>
                <span className="planet-sign">{planet.sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Traits */}
        <div className="kundali-section-card glass-panel fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3>🧠 Personality Traits</h3>
          <p>{reading.personalityTraits}</p>
        </div>

        {/* Life Path */}
        <div className="kundali-section-card glass-panel fade-in-up" style={{ animationDelay: '0.35s' }}>
          <h3>🛤️ Life Path & Career</h3>
          <p>{reading.lifePath}</p>
        </div>

        {/* Strengths & Challenges */}
        <div className="two-col-row">
          <div className="kundali-section-card glass-panel strengths-card fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3>💪 Strengths</h3>
            <ul>
              {reading.strengths && reading.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="kundali-section-card glass-panel challenges-card fade-in-up" style={{ animationDelay: '0.45s' }}>
            <h3>⚡ Challenges</h3>
            <ul>
              {reading.challenges && reading.challenges.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

KundaliReading.propTypes = {
  reading: PropTypes.shape({
    sunSign: PropTypes.string.isRequired,
    moonSign: PropTypes.string.isRequired,
    ascendant: PropTypes.string.isRequired,
    planets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      sign: PropTypes.string,
    })),
    personalityTraits: PropTypes.string,
    lifePath: PropTypes.string,
    strengths: PropTypes.arrayOf(PropTypes.string),
    challenges: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  userName: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};
