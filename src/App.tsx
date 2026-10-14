import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { PageTransition } from './components/PageTransition';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

import { Check, AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aws_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('aws_theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, isError: boolean = false) => {
    setToast({ message, isError });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ScrollToTop />
        <ScrollProgress />

        <Header theme={theme} toggleTheme={toggleTheme} />

        <main style={{ flex: 1 }}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact onShowToast={showToast} />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              {/* Redirect removed admin & login portals to home */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/schedule" element={<Navigate to="/" replace />} />
              <Route path="/speakers" element={<Navigate to="/" replace />} />
              <Route path="/gallery" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />

        {/* Global Toast Alert */}
        {toast && (
          <aside
            id="toast"
            role="status"
            aria-live="polite"
            className={`noise-toast ${toast.isError ? 'toast-error' : 'toast-success'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              {toast.isError ? (
                <AlertCircle size={18} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
              ) : (
                <Check size={18} style={{ color: 'var(--accent-toxic)', flexShrink: 0 }} />
              )}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </aside>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
