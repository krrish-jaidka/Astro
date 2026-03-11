import React, { useState } from 'react';
import SignSelector from './components/SignSelector';
import DailyReading from './components/DailyReading';
import KundaliForm from './components/KundaliForm';
import KundaliReading from './components/KundaliReading';
import { getKundaliReading } from './utils/astrologyData';

function App() {
  const [activeView, setActiveView] = useState('home'); // 'home', 'reading', 'kundaliForm', 'kundaliReading', 'kundaliLoading'
  const [selectedSign, setSelectedSign] = useState(null);
  const [kundaliData, setKundaliData] = useState(null);
  const [kundaliUserName, setKundaliUserName] = useState('');

  const handleSelectSign = (sign) => {
    setTimeout(() => {
      setSelectedSign(sign);
      setActiveView('reading');
    }, 150);
  };

  const handleBackToHome = () => {
    setSelectedSign(null);
    setKundaliData(null);
    setActiveView('home');
  };

  const handleGoToKundali = () => {
    setActiveView('kundaliForm');
  };

  const handleKundaliSubmit = async (formData) => {
    setKundaliUserName(formData.fullName);
    setActiveView('kundaliLoading');
    try {
      const reading = await getKundaliReading(formData);
      setKundaliData(reading);
      setActiveView('kundaliReading');
    } catch {
      setActiveView('kundaliForm');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'reading':
        return <DailyReading sign={selectedSign} onBack={handleBackToHome} />;
      case 'kundaliForm':
        return <KundaliForm onSubmit={handleKundaliSubmit} onBack={handleBackToHome} />;
      case 'kundaliLoading':
        return (
          <div className="kundali-loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Consulting the cosmos for your Kundali...</p>
          </div>
        );
      case 'kundaliReading':
        return <KundaliReading reading={kundaliData} userName={kundaliUserName} onBack={handleBackToHome} />;
      default:
        return (
          <>
            <div className="home-nav fade-in-up">
              <button className="btn-primary nav-btn" onClick={handleGoToKundali}>
                🪐 Get My Kundali
              </button>
            </div>
            <SignSelector onSelect={handleSelectSign} />
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <header className="header" onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
        <h1>AstroDaily</h1>
        <p>Your cosmic guide to the day ahead. Discover what the universe has in store for you.</p>
      </header>
      
      <main>
        {renderView()}
      </main>

      <footer className="app-footer">
        <p>Built with 💫 by <strong>Krrish Jaidka</strong> · Powered by Gemini AI</p>
        <p className="footer-copy">© {new Date().getFullYear()} AstroDaily. For entertainment purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
