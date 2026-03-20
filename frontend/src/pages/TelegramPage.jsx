import React, { useState } from 'react';
import { userApi } from '../api/services';
import { MessageSquare, Copy, Check, RefreshCw, ExternalLink, Info } from 'lucide-react';
import './TelegramPage.css';

export default function TelegramPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.generateConnectCode();
      // Backend returns: { connectCode: "123456", message: "..." }
      setCode(res.data?.connectCode || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { n: 1, text: 'Click "Generate Code" below to get your 6-digit connect code.' },
    { n: 2, text: 'Open your Telegram app and search for @StandupAI_bot (your bot).' },
    { n: 3, text: 'Send the 6-digit code as a message to the bot.' },
    { n: 4, text: 'You\'ll receive a confirmation. Your account is now linked!' },
  ];

  return (
    <div className="telegram-page container">
      {/* Header */}
      <div className="telegram-header fade-in">
        <div className="telegram-title-row">
          <MessageSquare size={22} className="title-icon" />
          <h1>Connect Telegram</h1>
        </div>
        <p>Link your Telegram account to receive formatted standup summaries directly in chat.</p>
      </div>

      <div className="telegram-grid">
        {/* Steps card */}
        <div className="card fade-in">
          <div className="card-heading">
            <Info size={16} />
            <h2>How it works</h2>
          </div>
          <div className="steps-list">
            {steps.map(({ n, text }) => (
              <div key={n} className="step-item">
                <div className="step-number">{n}</div>
                <p className="step-text">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate card */}
        <div className="card fade-in">
          <div className="card-heading">
            <MessageSquare size={16} />
            <h2>Your Connect Code</h2>
          </div>
          <p className="card-sub">Codes expire in 15 minutes. Generate a new one if it expires.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          {code ? (
            <div className="code-display">
              <div className="code-value">{code}</div>
              <button className={`btn ${copied ? 'btn-secondary' : 'btn-primary'} copy-btn`} onClick={handleCopy}>
                {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
              </button>
              <button className="btn btn-secondary regen-btn" onClick={handleGenerate} disabled={loading}>
                <RefreshCw size={15} /> New Code
              </button>
            </div>
          ) : (
            <div className="code-empty">
              <div className="code-placeholder">– – – – – –</div>
              <p>No code generated yet</p>
            </div>
          )}

          <button
            className="btn btn-primary btn-full generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            style={{ marginTop: 20 }}
          >
            {loading
              ? <><div className="spinner" /> Generating...</>
              : code ? <><RefreshCw size={15} /> Regenerate Code</> : <><MessageSquare size={15} /> Generate Code</>
            }
          </button>

          <a
            href="https://t.me/mystandup_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="open-telegram-btn"
          >
            <ExternalLink size={14} />
            Open Telegram Bot
          </a>
        </div>
      </div>
    </div>
  );
}
