import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Bot, 
  Sun, 
  Moon, 
  LogOut, 
  LayoutDashboard, 
  History, 
  BarChart2, 
  MessageSquare,
  Menu,
  X 
} from 'lucide-react';
import { logout, selectUser } from '../store/authSlice';
import { toggleTheme, selectTheme } from '../store/themeSlice';

const navLinks = [
  { to: '/dashboard',       label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/history',         label: 'History',      icon: History },
  { to: '/weekly',          label: 'Weekly',       icon: BarChart2 },
  { to: '/telegram-connect',label: 'Telegram',     icon: MessageSquare },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center bg-[var(--bg-secondary)]/80 border-b border-[var(--border)] backdrop-blur-xl px-4 md:px-8">
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-main flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <Bot size={20} />
          </div>
          <span className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            StandupAI
          </span>
        </Link>

        {/* Desktop Nav links (Logged In) */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === to 
                    ? 'bg-[var(--accent-glow)] text-[var(--accent)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Guest Nav links (Not Logged In) */}
        {!user && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 bg-gradient-main text-white text-sm font-bold rounded-lg shadow-lg shadow-primary-500/10 hover:-translate-y-0.5 transition-all">
              Register Free
            </Link>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <>
              <span className="hidden lg:inline-block text-[var(--text-secondary)] text-sm font-medium mx-2 italic">
                {user.name?.split(' ')[0]} 👋
              </span>
              <button 
                className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[rgb(239,68,68,0.08)] hover:text-red-500 hover:border-red-500 transition-all" 
                onClick={handleLogout} 
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 gap-1">
            {user ? (
              navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === to 
                      ? 'bg-[var(--accent-glow)] text-[var(--accent)]' 
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-base font-medium text-[var(--text-secondary)]">Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="mx-4 my-2 px-6 py-3 bg-gradient-main text-white text-center font-bold rounded-xl shadow-lg shadow-primary-500/20">Register Free</Link>
              </>
            )}
            
            {user && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-500 font-medium"
              >
                <LogOut size={20} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
