import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy-load future pages
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const HistoryPage    = lazy(() => import('./pages/HistoryPage'));
const WeeklyPage     = lazy(() => import('./pages/WeeklyPage'));
const TelegramPage   = lazy(() => import('./pages/TelegramPage'));
const LandingPage    = lazy(() => import('./pages/LandingPage'));

function AppLayout({ children, isLanding = false }) {
  return (
    <div className={`min-h-screen flex flex-col ${!isLanding ? 'pt-16 md:pt-20' : ''}`}>
      <Navbar />
      <main className={!isLanding ? 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10' : 'flex-1'}>
        {children}
      </main>
    </div>
  );
}

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a] text-white">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-white/60 font-medium animate-pulse">Initializing StandupAI...</p>
  </div>
);

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<AppLayout isLanding={true}><LandingPage /></AppLayout>} />
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

            {/* Redirect root (Handled by LandingPage above) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}
