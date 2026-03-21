import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Bot, CheckCircle2, Star, Users, PieChart } from 'lucide-react';
import { authApi } from '../api/services';
import { loginSuccess } from '../store/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(form);
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]
        || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] overflow-hidden">
      {/* Left Side - Visual Pitch */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-main p-16 flex-col justify-between overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white mb-20 group">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-105 transition-transform">
              <Bot size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">StandupAI</span>
          </Link>

          <h2 className="text-5xl font-extrabold text-white leading-tight mb-8">
            Join 2,000+ teams <br /> building <span className="text-white/70 italic">faster</span> <br /> every single day.
          </h2>
          
          <div className="space-y-6 max-w-md">
            <PitchItem icon={Users} text="Collaborate seamlessly with your entire team" />
            <PitchItem icon={Star} text="Get automated weekly performance summaries" />
            <PitchItem icon={PieChart} text="Visualize progress with personalized logs" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 max-w-md shadow-2xl ring-1 ring-white/30">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-white/90 text-lg font-medium mb-6">
              "The setup was instant. Connected to Telegram in 30 seconds and our first standup was live."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white font-bold">AS</div>
              <div>
                <p className="text-white font-bold text-sm">Alex Smith</p>
                <p className="text-white/60 text-xs text-nowrap">Product Manager @ ShipIt</p>
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
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Create Account</h1>
            <p className="text-[var(--text-secondary)]">Start your 14-day free trial today</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-3.5 bg-[var(--bg-card)] border-[1.5px] border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all text-[15px] shadow-sm"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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
              <label className="text-[13px] font-bold text-[var(--text-secondary)] uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3.5 bg-[var(--bg-card)] border-[1.5px] border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-4 focus:ring-primary-500/10 transition-all pr-12 text-[15px] shadow-sm"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            <div className="mt-2 flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded text-[var(--accent)] border-[var(--border)] focus:ring-[var(--accent)]" required />
              <label htmlFor="terms" className="text-xs text-[var(--text-secondary)] leading-relaxed">
                By creating an account, I agree to the <a href="#" className="font-bold text-[var(--text-primary)] hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-[var(--text-primary)] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 py-4 bg-gradient-main hover:scale-[1.01] active:scale-[0.98] text-white font-bold rounded-xl shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-[16px]"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Free Account <UserPlus size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] font-bold hover:underline transition-all">Sign in here</Link>
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
