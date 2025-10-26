import React from 'react';

interface VoiceWelcomeScreenProps {
  onDismiss: () => void;
  onStartVoice: () => void;
}

const VoiceWelcomeScreen: React.FC<VoiceWelcomeScreenProps> = ({
  onDismiss,
  onStartVoice
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
    padding: '16px'
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div style={overlayStyle} className="voice-welcome-overlay">
      <div className="voice-welcome-card">
        <div className="voice-welcome-animation">
          <div className="voice-icon-large">🎤</div>
          <div className="sound-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>
        
        <h2 className="voice-welcome-title">
          Talk to Your Financial Advisor
        </h2>
        
        <p className="voice-welcome-description">
          Have a natural conversation about your purchases and financial decisions. 
          Just tap the microphone and start talking!
        </p>
        
        <div className="voice-features">
          <div className="voice-feature">
            <span className="feature-icon">💬</span>
            <span>Natural conversation</span>
          </div>
          <div className="voice-feature">
            <span className="feature-icon">🎯</span>
            <span>Personalized advice</span>
          </div>
          <div className="voice-feature">
            <span className="feature-icon">⚡</span>
            <span>Instant responses</span>
          </div>
        </div>
        
        <div className="voice-welcome-actions">
          <button 
            className="voice-start-btn"
            onClick={onStartVoice}
          >
            <span className="btn-icon">🎤</span>
            Start Voice Chat
          </button>
          <button 
            className="voice-skip-btn"
            onClick={onDismiss}
          >
            Type Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceWelcomeScreen;