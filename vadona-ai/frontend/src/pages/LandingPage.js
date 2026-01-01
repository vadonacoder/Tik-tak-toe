import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1>Welcome to Vadona AI</h1>
        <p>Your Indian AI Assistant for smarter conversations.</p>
        <a href="/register" className="cta-button">Get Started</a>
      </header>

      <section className="features-section">
        <h2>Why Choose Vadona AI?</h2>
        <div className="features">
          <div className="feature">
            <h3>Smart Conversations</h3>
            <p>Engage in meaningful and intelligent discussions tailored to your needs.</p>
          </div>
          <div className="feature">
            <h3>Secure and Private</h3>
            <p>Your data is safe with us. We prioritize your privacy and security.</p>
          </div>
          <div className="feature">
            <h3>Made for India</h3>
            <p>Designed to understand and cater to the diverse needs of Indian users.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Vadona AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;