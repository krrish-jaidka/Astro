// src/components/KundaliForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './KundaliForm.css';

export default function KundaliForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.fullName && formData.dateOfBirth && formData.timeOfBirth && formData.placeOfBirth;

  return (
    <div className="kundali-form-container">
      <button className="btn-back-nav" onClick={onBack}>
        ← Back to Home
      </button>

      <div className="kundali-intro fade-in-up">
        <span className="intro-icon">🪐</span>
        <h2>Your Personal Kundali</h2>
        <p>Enter your birth details to unveil your Vedic birth chart and cosmic blueprint.</p>
      </div>

      <form className="kundali-form glass-panel fade-in-up" style={{ padding: '2.5rem', animationDelay: '0.1s' }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="e.g. Krrish Jaidka"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeOfBirth">Time of Birth</label>
            <input
              type="time"
              id="timeOfBirth"
              name="timeOfBirth"
              value={formData.timeOfBirth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="placeOfBirth">Place of Birth</label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            placeholder="e.g. Mumbai, India"
            value={formData.placeOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-generate"
          disabled={!isFormValid}
        >
          ✨ Generate My Kundali
        </button>
      </form>
    </div>
  );
}

KundaliForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
