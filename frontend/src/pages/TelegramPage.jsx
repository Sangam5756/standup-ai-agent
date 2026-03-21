import React, { useState } from 'react';
import { userApi } from '../api/services';
import { MessageSquare, Copy, Check, RefreshCw, ExternalLink, Info } from 'lucide-react';

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
    { n: 2, text: 'Open your Telegram app and search for @mystandup_bot (your bot).' },
    { n: 3, text: 'Send the 6-digit code as a message to the bot.' },
    { n: 4, text: 'You\'ll receive a confirmation. Your account is now linked!' },
  ];

  return (
    <div className="flex flex-col gap-[24px] pt-3 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 mb-1 relative">
          <MessageSquare size={22} className="text-[var(--accent)]" />
          <h1 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">Connect Telegram</h1>
        </div>
        <p className="text-[14px] text-[var(--text-secondary)]">Link your Telegram account to receive formatted standup summaries directly in chat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Steps card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-8 shadow-sm animate-in fade-in duration-400 overflow-hidden">
          <div className="flex items-center gap-2.5 text-[var(--text-primary)] mb-4">
            <Info size={16} className="text-[var(--accent)]" />
            <h2 className="text-[16px] font-bold">How it works</h2>
          </div>
          <div className="flex flex-col gap-[18px] mt-4">
            {steps.map(({ n, text }) => (
              <div key={n} className="flex items-start gap-3.5 group">
                <div className="w-[30px] h-[30px] rounded-lg bg-[var(--accent-glow)] text-[var(--accent)] flex items-center justify-center text-[14px] font-bold shrink-0">
                  {n}
                </div>
                <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-8 shadow-sm animate-in fade-in duration-400 overflow-hidden">
          <div className="flex items-center gap-2.5 text-[var(--text-primary)] mb-1.5">
            <MessageSquare size={16} className="text-[var(--accent)]" />
            <h2 className="text-[16px] font-bold">Your Connect Code</h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mb-6">Codes expire in 15 minutes. Generate a new one if it expires.</p>

          {error && <div className="p-3.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-[10px] text-[var(--danger)] text-sm font-medium mb-4">{error}</div>}

          {code ? (
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex items-center gap-2.5 w-full">
                <div className="flex-1 text-[24px] sm:text-[32px] font-extrabold tracking-[4px] sm:tracking-[8px] text-[var(--text-primary)] bg-[var(--bg-primary)] border-2 border-[var(--accent)] rounded-xl py-3 shadow-[0_0_0_4px_var(--accent-glow)] text-center font-mono">
                  {code}
                </div>
              </div>
              <div className="flex gap-2.5 w-full">
                <button 
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] font-semibold text-[13px] transition-all ${
                    copied ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border)]' : 'bg-gradient-main text-white shadow-lg shadow-primary-500/20'
                  }`} 
                  onClick={handleCopy}
                >
                  {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-transparent text-[var(--text-secondary)] border-[1.5px] border-[var(--border)] rounded-[10px] font-semibold text-[13px] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50" 
                  onClick={handleGenerate} 
                  disabled={loading}
                >
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> New Code
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 mb-4">
              <div className="text-[28px] font-extrabold tracking-[8px] text-[var(--text-muted)] bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)] rounded-xl py-3 px-6 font-mono">
                –– –– ––
              </div>
              <p className="text-[13px] text-[var(--text-muted)] font-medium">No code generated yet</p>
            </div>
          )}

          <button
            className="w-full py-3 bg-gradient-main text-white font-bold rounded-[10px] shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[15px]"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              code ? <><RefreshCw size={15} /> Regenerate Code</> : <><MessageSquare size={15} /> Generate Code</>
            )}
          </button>

          <a
            href="https://t.me/mystandup_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mt-5 text-[14px] font-medium text-[var(--accent)] hover:opacity-75 transition-opacity"
          >
            <ExternalLink size={14} />
            Open Telegram Bot
          </a>
        </div>
      </div>
    </div>
  );
}
