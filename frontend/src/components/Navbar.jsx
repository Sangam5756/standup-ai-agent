import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, Sun, Moon, LogOut, LayoutDashboard, History, BarChart2, MessageSquare } from 'lucide-react';
import { logout, selectUser } from '../store/authSlice';
import { toggleTheme, selectTheme } from '../store/themeSlice';
import './Navbar.css';

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-brand-icon"><Bot size={20} /></div>
        <span>StandupAI</span>
      </Link>

      {/* Nav links */}
      <div className="navbar-links">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`navbar-link ${location.pathname === to ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>

      {/* Right actions */}
      <div className="navbar-actions">
        {user && <span className="navbar-user">Hi, {user.name?.split(' ')[0]} 👋</span>}

        <button
          className="navbar-icon-btn"
          onClick={() => dispatch(toggleTheme())}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="navbar-icon-btn navbar-logout" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
