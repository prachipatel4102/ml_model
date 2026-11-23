import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">&#127891;</span>
          <div>
            <h1>Student Performance Portal</h1>
            <p className="subtitle">Study Hours vs. Exam Outcome Predictor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
