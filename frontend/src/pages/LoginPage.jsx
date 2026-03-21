import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Bot, CheckCircle2, Zap, MessageSquare, Shield } from 'lucide-react';
import { authApi } from '../api/services';
import { loginSuccess } from '../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(form);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] overflow-hidden">
      {/* Left Side - Visual Pitch */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-main p-16 flex-col justify-between overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white mb-20 group">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-105 transition-transform">
              <Bot size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">StandupAI</span>
          </Link>

          <h2 className="text-5xl font-extrabold text-white leading-tight mb-8">
            Your developers <br /> will <span className="text-white/70 italic">actually</span> <br /> love standups.
          </h2>
          
          <div className="space-y-6 max-w-md">
            <PitchItem icon={Zap} text="AI-powered formatting from casual notes" />
            <PitchItem icon={MessageSquare} text="One-click integration with Telegram" />
            <PitchItem icon={Shield} text="Secure, private, and personalized logs" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 max-w-md">
            <p className="text-white/90 text-lg italic mb-4">
              "StandupAI changed how our team syncs. We save at least 20 minutes every single day."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold">JD</div>
              <div>
                <p className="text-white font-bold text-sm">John Doe</p>
                <p className="text-white/60 text-xs text-nowrap">Lead Engineer @ Techflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative">
        {/* Mobile Background blobs */}
        <div className="lg:hidden fixed top-[-20%] right-[-10%] w-[300px] h-[300px] auth-glow-top pointer-events-none opacity-40"></div>
        <div className="lg:hidden fixed bottom-[-20%] left-[-10%] w-[300px] h-[300px] auth-glow-bottom pointer-events-none opacity-40"></div>

        <div className="w-full max-w-[420px] relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-gradient-main flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">StandupAI</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[var(--text-secondary)]">Sign in to manage your team updates</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-3.5 bg-[var(--bg-card)] border-[1.5px] border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all text-[15px] shadow-sm"
                placeholder="developer@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider" htmlFor="password">Password</label>
                <a href="#" className="text-[12px] font-bold text-[var(--accent)] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3.5 bg-[var(--bg-card)] border-[1.5px] border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all pr-12 text-[15px] shadow-sm"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-4 bg-gradient-main hover:scale-[1.01] active:scale-[0.98] text-white font-bold rounded-xl shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[16px]"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in to Dashboard <LogIn size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[var(--accent)] font-bold hover:underline transition-all">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PitchItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-4 text-white/90">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}
