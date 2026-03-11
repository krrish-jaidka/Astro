import React, { useState } from 'react';
import SignSelector from './components/SignSelector';
import DailyReading from './components/DailyReading';

function App() {
  const [selectedSign, setSelectedSign] = useState(null);

  const handleSelectSign = (sign) => {
    // Add a small delay for smoother transition
    setTimeout(() => {
      setSelectedSign(sign);
    }, 150);
  };

  const handleBackToSigns = () => {
    setSelectedSign(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AstroDaily</h1>
        <p>Your cosmic guide to the day ahead. Discover what the universe has in store for you.</p>
      </header>
      
      <main>
        {!selectedSign ? (
          <SignSelector onSelect={handleSelectSign} />
        ) : (
          <DailyReading sign={selectedSign} onBack={handleBackToSigns} />
        )}
      </main>
    </div>
  );
}

export default App;
