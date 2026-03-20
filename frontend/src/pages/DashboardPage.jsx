import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { standupApi } from '../api/services';
import {
  Send, Clock, CheckCircle2, XCircle,
  MessageSquare, Zap, TrendingUp, AlarmClock
} from 'lucide-react';
import './DashboardPage.css';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

function HistoryCard({ entry }) {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="history-card fade-in">
      <div className="history-card-header">
        <div className="history-meta">
          <span className="history-dev">{entry.developerName}</span>
          <span className="history-date"><AlarmClock size={12} /> {formattedDate}</span>
        </div>
        <span className={`badge ${entry.telegramSent ? 'badge-success' : 'badge-danger'}`}>
          {entry.telegramSent ? <><CheckCircle2 size={11} /> Sent</> : <><XCircle size={11} /> Failed</>}
        </span>
      </div>
      <p className="history-content">{entry.formattedStandup}</p>
    </div>
  );
}

export default function DashboardPage() {
  const user = useSelector(selectUser);
  const [rawUpdate, setRawUpdate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type: 'success'|'error', msg }
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await standupApi.getHistory();
      // HistoryController returns ResponseEntity<List<StandupEntry>> directly
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawUpdate.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      // StandupController expects { rawUpdate } and returns ApiResponse<String>
      await standupApi.submit({ rawUpdate });
      setSubmitResult({ type: 'success', msg: '✅ Standup submitted! Check your Telegram.' });
      setRawUpdate('');
      fetchHistory();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to submit standup. Make sure your Telegram is connected.';
      setSubmitResult({ type: 'error', msg });
    } finally {
      setSubmitting(false);
    }
  };

  const totalSent = history.filter(h => h.telegramSent).length;

  return (
    <div className="dashboard-page container">
      {/* Welcome header */}
      <div className="dashboard-header fade-in">
        <div>
          <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>What did you work on today?</p>
        </div>
        <div className="header-badge">
          <Zap size={14} />
          AI-Powered
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row fade-in">
        <StatCard icon={MessageSquare} label="Total Standups" value={history.length} color="rgba(99,102,241,0.15)" />
        <StatCard icon={CheckCircle2} label="Sent to Telegram" value={totalSent} color="rgba(16,185,129,0.15)" />
        <StatCard icon={TrendingUp} label="This Week" value={history.slice(0, 7).length} color="rgba(245,158,11,0.15)" />
      </div>

      <div className="dashboard-grid">
        {/* Submit form */}
        <div className="card dashboard-submit-card">
          <div className="card-heading">
            <Send size={18} />
            <h2>Submit Today's Standup</h2>
          </div>
          <p className="card-sub">Write a casual update — AI will format and send it to Telegram.</p>

          <form onSubmit={handleSubmit} className="standup-form">
            {submitResult && (
              <div className={`alert ${submitResult.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {submitResult.msg}
              </div>
            )}
            <textarea
              className="form-input standup-textarea"
              placeholder={"e.g. Yesterday I finished the JWT auth, today I'm working on frontend. No blockers."}
              value={rawUpdate}
              onChange={e => setRawUpdate(e.target.value)}
              rows={5}
              required
            />
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting || !rawUpdate.trim()}>
              {submitting ? <><div className="spinner" /> Processing...</> : <><Send size={15} /> Submit Standup</>}
            </button>
          </form>
        </div>

        {/* Recent history */}
        <div className="card dashboard-history-card">
          <div className="card-heading">
            <Clock size={18} />
            <h2>Recent Standups</h2>
          </div>

          {loadingHistory ? (
            <div className="history-loading">
              <div className="spinner" style={{ borderTopColor: 'var(--accent)' }} />
              <span>Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <MessageSquare size={40} />
              <p>No standups yet. Submit your first one!</p>
            </div>
          ) : (
            <div className="history-list">
              {history.slice(0, 5).map((entry, i) => (
                <HistoryCard key={entry.id ?? i} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
