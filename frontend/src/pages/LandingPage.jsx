import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { 
  Bot, 
  Zap, 
  MessageSquare, 
  BarChart2, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Smartphone
} from 'lucide-react';

export default function LandingPage() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Navbar Placeholder for Landing (since App.jsx will handle it) */}
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background blobs */}
        <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full auth-glow-top opacity-50 pointer-events-none"></div>
        <div className="fixed bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full auth-glow-bottom opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] border border-[rgba(99,102,241,0.2)] text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Zap size={16} />
            The Future of Team Standups
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Automate Your <span className="text-transparent bg-clip-text bg-gradient-main">Daily Standups</span> <br className="hidden md:block" /> with AI Magic.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-secondary)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Focus on writing code, not status reports. StandupAI transforms your casual updates into professional formatted reports and sends them directly to Telegram.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-main text-white font-bold rounded-xl shadow-xl shadow-primary-500/20 hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg">
              Start Building for Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[var(--border)] text-[var(--text-primary)] font-bold rounded-xl hover:bg-[var(--bg-card-hover)] transition-all text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Why Modern Teams Choose StandupAI</h2>
            <p className="text-[var(--text-secondary)] text-lg">Everything you need to keep your team synced without the friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Bot} 
              title="AI Formatting" 
              desc="Our AI understands developer lingo. It takes your rough notes and crafts a perfect, professional standup report."
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Telegram Integration" 
              desc="Receive your standups directly in your team chats. No need to switch apps or check yet another dashboard."
            />
            <FeatureCard 
              icon={BarChart2} 
              title="Weekly Insights" 
              desc="Get a bird's eye view of your week. Automated summaries help you track progress and identify blockers."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Security */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield size={120} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-8">Secure. Private. Personalized.</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
            Your standups are your business. We provide personalized history and insights with industry-standard security and privacy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <CheckCircle2 className="text-[var(--success)]" /> 256-bit Encryption
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <CheckCircle2 className="text-[var(--success)]" /> GDPR Compliant
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <CheckCircle2 className="text-[var(--success)]" /> 99.9% Uptime
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-8">Ready to Level Up Your Daily Standups?</h2>
        <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-main text-white font-bold rounded-2xl shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all text-xl">
          Get Started Now — It's Free
        </Link>
        <p className="mt-6 text-[var(--text-secondary)] font-medium">No credit card required. Cancel anytime.</p>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">StandupAI</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            © 2026 StandupAI. Made with ❤️ for developers by developers.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[0_0_40px_-20px_var(--accent)] transition-all group">
      <div className="w-16 h-16 rounded-2xl bg-[var(--accent-glow)] text-[var(--accent)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  );
}
