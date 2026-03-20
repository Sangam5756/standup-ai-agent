import React, { useState } from 'react';
import { standupApi } from '../api/services';
import { BarChart2, RefreshCw, Sparkles } from 'lucide-react';
import './WeeklyPage.css';

export default function WeeklyPage() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await standupApi.getWeeklySummary();
      setSummary(res.data?.data || res.data || '');
      setGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse bullet points from summary text
  const lines = summary.split('\n').filter(l => l.trim());

  return (
    <div className="weekly-page container">
      {/* Header */}
      <div className="weekly-header fade-in">
        <div className="weekly-title-row">
          <BarChart2 size={22} className="title-icon" />
          <h1>Weekly Summary</h1>
        </div>
        <p>AI-generated overview of your last 7 days of work.</p>
      </div>

      {/* Generate card */}
      <div className="card weekly-generate-card fade-in">
        <div className="weekly-generate-body">
          <div className="weekly-generate-left">
            <div className="ai-badge"><Sparkles size={14} /> Powered by AI</div>
            <h2>Generate Your Week Recap</h2>
            <p>The AI will read your last 7 standup entries and summarize your accomplishments, focus areas, and any recurring blockers.</p>
          </div>
          <button
            className="btn btn-primary weekly-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? <><div className="spinner" /> Generating...</>
              : generated
                ? <><RefreshCw size={15} /> Regenerate</>
                : <><Sparkles size={15} /> Generate Summary</>
            }
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error fade-in">{error}</div>}

      {/* Summary output */}
      {generated && summary && (
        <div className="card weekly-result-card fade-in">
          <div className="weekly-result-header">
            <Sparkles size={16} className="title-icon" />
            <h3>Your Week in Review</h3>
          </div>
          <div className="weekly-result-content">
            {lines.map((line, i) => {
              const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
              return isBullet
                ? <div key={i} className="summary-bullet">
                    <span className="bullet-dot" />
                    <span>{line.replace(/^[-•*]\s*/, '')}</span>
                  </div>
                : <p key={i} className="summary-text">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
