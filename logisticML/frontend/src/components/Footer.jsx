import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Student Performance System &bull; Machine Learning Logistic Regression</p>
      </div>
    </footer>
  );
}
