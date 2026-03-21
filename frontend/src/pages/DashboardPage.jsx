import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { 
  fetchStandups, 
  submitStandup, 
  selectAllStandups, 
  selectStandupLoading 
} from '../store/standupSlice';
import {
  Send, Clock, CheckCircle2, XCircle,
  MessageSquare, Zap, TrendingUp, AlarmClock
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-[20px_24px] flex items-center gap-4 hover:border-[var(--border-focus)] transition-colors">
      <div className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-[var(--text-primary)] shrink-0" style={{ background: color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[12px] text-[var(--text-muted)] font-medium uppercase tracking-[0.5px]">{label}</p>
        <p className="text-[22px] font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function HistoryCard({ entry }) {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[12px] p-[14px_16px] hover:border-[var(--accent)] transition-colors animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">{entry.developerName}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <AlarmClock size={12} /> {formattedDate}
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
          entry.telegramSent 
            ? 'bg-[rgba(16,185,129,0.15)] text-[var(--success)]' 
            : 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]'
        }`}>
          {entry.telegramSent ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
          {entry.telegramSent ? 'Sent' : 'Failed'}
        </span>
      </div>
      <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] line-clamp-3 overflow-hidden">
        {entry.formattedStandup}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const history = useSelector(selectAllStandups);
  const loadingHistory = useSelector(selectStandupLoading);
  const [rawUpdate, setRawUpdate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    dispatch(fetchStandups());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawUpdate.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      await dispatch(submitStandup({ rawUpdate })).unwrap();
      setSubmitResult({ type: 'success', msg: '✅ Standup submitted! Check your Telegram.' });
      setRawUpdate('');
    } catch (err) {
      setSubmitResult({ type: 'error', msg: err || 'Failed to submit standup.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalSent = history.filter(h => h.telegramSent).length;
  // Dashboard shows only top 5 recent
  const recentHistory = history.slice(0, 5);

  return (
    <div className="flex flex-col gap-[28px] pt-3 pb-12">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-[14px] md:text-[15px] text-[var(--text-secondary)] mt-1">What did you work on today?</p>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] border border-[rgba(99,102,241,0.2)] text-[12px] md:text-[13px] font-semibold w-fit">
          <Zap size={14} />
          AI-Powered
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={MessageSquare} label="Total Standups" value={history.length} color="rgba(99,102,241,0.15)" />
        <StatCard icon={CheckCircle2} label="Sent to Telegram" value={totalSent} color="rgba(16,185,129,0.15)" />
        <StatCard icon={TrendingUp} label="This Week" value={history.slice(0, 7).length} color="rgba(245,158,11,0.15)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Submit form */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center gap-2.5 text-[var(--accent)] mb-1.5">
            <Send size={18} />
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Submit Today's Standup</h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mb-6">Write a casual update — AI will format and send it to Telegram.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {submitResult && (
              <div className={`p-3 px-4 rounded-[10px] text-[14px] font-medium border animate-in slide-in-from-top-2 ${
                submitResult.type === 'success' 
                  ? 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[var(--success)]' 
                  : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[var(--danger)]'
              }`}>
                {submitResult.msg}
              </div>
            )}
            <textarea
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border-[1.5px] border-[var(--border)] rounded-[10px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all min-h-[140px] text-[15px] resize-none"
              placeholder={"e.g. Yesterday I finished the JWT auth, today I'm working on frontend. No blockers."}
              value={rawUpdate}
              onChange={e => setRawUpdate(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-main text-white font-bold rounded-[10px] shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[15px]" 
              disabled={submitting || !rawUpdate.trim()}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Standup</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent history */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center gap-2.5 text-[var(--accent)] mb-1.5">
            <Clock size={18} />
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Recent Standups</h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mb-6">Your latest daily updates.</p>

          <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
            {loadingHistory && history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--text-muted)]">
                <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading history...</span>
              </div>
            ) : recentHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--text-muted)] text-center">
                <MessageSquare size={40} className="opacity-20" />
                <p className="text-sm">No standups yet. Submit your first one!</p>
              </div>
            ) : (
              recentHistory.map((entry, i) => (
                <HistoryCard key={entry.id ?? i} entry={entry} />
              ))
            )}
          </div>
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
