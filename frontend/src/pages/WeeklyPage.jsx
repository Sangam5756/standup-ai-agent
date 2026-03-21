import React, { useState } from 'react';
import { standupApi } from '../api/services';
import { BarChart2, RefreshCw, Sparkles } from 'lucide-react';

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

  const lines = summary.split('\n').filter(l => l.trim());

  return (
    <div className="flex flex-col gap-[24px] pt-3 pb-12 max-w-[760px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 mb-1 relative">
          <BarChart2 size={22} className="text-[var(--accent)]" />
          <h1 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">Weekly Summary</h1>
        </div>
        <p className="text-[14px] text-[var(--text-secondary)]">AI-generated overview of your last 7 days of work.</p>
      </div>

      {/* Generate card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[28px_32px] shadow-sm animate-in fade-in duration-400">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] text-[12px] font-semibold w-fit">
              <Sparkles size={14} /> Powered by AI
            </div>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Generate Your Week Recap</h2>
            <p className="text-[14px] text-[var(--text-secondary)] max-w-[480px] leading-[1.5]">The AI will read your last 7 standup entries and summarize your accomplishments, focus areas, and any recurring blockers.</p>
          </div>
          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-7 bg-gradient-main text-white font-bold rounded-[10px] shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 text-[15px]"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              generated
                ? <><RefreshCw size={15} /> Regenerate</>
                : <><Sparkles size={15} /> Generate Summary</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="p-3.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-[10px] text-[var(--danger)] text-[14px] font-medium animate-in fade-in">{error}</div>}

      {/* Summary output */}
      {generated && summary && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[28px_32px] shadow-sm animate-in fade-in duration-400">
          <div className="flex items-center gap-2 text-[var(--text-primary)] border-b border-[var(--border)] pb-3.5 mb-5">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <h3 className="text-[16px] font-bold">Your Week in Review</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {lines.map((line, i) => {
              const cleanedLine = line.trim().replace(/^[-•*]\s*/, '');
              const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
              return isBullet ? (
                <div key={i} className="flex items-start gap-2.5 text-[14px] text-[var(--text-primary)] leading-[1.6]">
                  <div className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] shrink-0 mt-[7.5px]" />
                  <p>{cleanedLine}</p>
                </div>
              ) : (
                <p key={i} className="text-[14px] text-[var(--text-secondary)] font-semibold leading-[1.6]">{line}</p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
