import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy-load future pages (placeholders for now)
const DashboardPage  = React.lazy(() => import('./pages/DashboardPage'));
const HistoryPage    = React.lazy(() => import('./pages/HistoryPage'));
const WeeklyPage     = React.lazy(() => import('./pages/WeeklyPage'));
const TelegramPage   = React.lazy(() => import('./pages/TelegramPage'));

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--text-secondary)'}}>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <AppLayout><HistoryPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/weekly" element={
              <ProtectedRoute>
                <AppLayout><WeeklyPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/telegram-connect" element={
              <ProtectedRoute>
                <AppLayout><TelegramPage /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Redirect root */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
}
