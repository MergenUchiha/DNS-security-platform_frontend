import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DnsPage from './pages/DnsPage';
import MitigationPage from './pages/MitigationPage';
import EventsPage from './pages/EventsPage';
import ReportPage from './pages/ReportPage';
import DemoPage from './pages/DemoPage';
import HealthPage from './pages/HealthPage';
import LoginPage from './pages/LoginPage';
import { useEffect } from 'react';
import { useSession } from './contexts/SessionContext';

function AppInner() {
  const { fetchCurrent } = useSession();
  useEffect(() => { fetchCurrent(); }, [fetchCurrent]);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dns" element={<DnsPage />} />
        <Route path="/mitigation" element={<MitigationPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </Layout>
  );
}

function AuthenticatedApp() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppInner />
        <AppToaster />
      </BrowserRouter>
    </SessionProvider>
  );
}

function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #374151',
          borderRadius: '10px',
          fontSize: '13px',
          fontFamily: 'JetBrains Mono, monospace',
        },
        success: { iconTheme: { primary: '#4ade80', secondary: '#1f2937' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#1f2937' } },
      }}
    />
  );
}

function AppGate() {
  const { token } = useAuth();

  if (!token) {
    return (
      <>
        <LoginPage />
        <AppToaster />
      </>
    );
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <AppGate />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
