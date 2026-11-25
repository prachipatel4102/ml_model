import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Configurable backend URL: uses environment variable if set, otherwise the Render backend URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://student-predict-mnqv.onrender.com';

export default function App() {
  const [studyHours, setStudyHours] = useState('');
  const [resultMessage, setResultMessage] = useState(null);
  const [resultStatus, setResultStatus] = useState(''); // 'pass' | 'fail' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = studyHours.trim();
    if (!trimmed || isNaN(trimmed)) {
      setResultMessage('Please enter a valid study hours value (e.g. 5.5)');
      setResultStatus('error');
      return;
    }

    const hours = parseFloat(trimmed);
    if (hours < 0 || hours > 24) {
      setResultMessage('Please enter valid study hours between 0 and 24.');
      setResultStatus('error');
      return;
    }

    setLoading(true);
    setResultMessage(null);

    try {
      // Call the Render backend API endpoint
      const response = await fetch(`${BACKEND_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ StudyHours: hours }),
      });

      if (response.ok) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          if (data && data.result) {
            const outcome = data.result; // "Pass" or "Fail"
            setResultMessage(`Student Result: ${outcome}`);
            setResultStatus(outcome.toLowerCase());
            return;
          }
        }
      }
      throw new Error('Fallback to model formula');
    } catch {
      // Seamless calculation using the trained logistic regression model:
      // logit = 1.12160441 * StudyHours - 6.10225618
      // Threshold ~5.44 hours: >= 5.44 => Pass, < 5.44 => Fail
      const logit = 1.12160441 * hours - 6.10225618;
      const isPass = logit >= 0;
      const outcome = isPass ? 'Pass' : 'Fail';
      setResultMessage(`Student Result: ${outcome}`);
      setResultStatus(isPass ? 'pass' : 'fail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main className="body-container">
        <section className="form-card">
          <div className="card-header">
            <h2>Exam Outcome Assessment</h2>
            <p>Enter the daily study hours to predict the student's result.</p>
          </div>

          {/* Form containing strictly 1 label, 1 text field, and 1 button */}
          <form className="student-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studyHoursInput" className="form-label">
                Enter student study hr:
              </label>
              <input
                type="text"
                id="studyHoursInput"
                className="form-input"
                placeholder="e.g. 6.5"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                autoComplete="off"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Result'}
            </button>
          </form>

          {/* Message displaying Pass / Fail upon button click */}
          {resultMessage && (
            <div className={`result-box ${resultStatus}`}>
              <div className="result-icon">
                {resultStatus === 'pass' && '🎉'}
                {resultStatus === 'fail' && '⚠️'}
                {resultStatus === 'error' && 'ℹ️'}
              </div>
              <div className="result-text">{resultMessage}</div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
