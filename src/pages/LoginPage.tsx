import { useState } from 'react';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Input } from '../components/ui';
import type { Lang } from '../i18n/translations';
import { Globe, Moon, Sun } from 'lucide-react';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'tk', label: 'TK' },
];

export default function LoginPage() {
  const { login, register } = useAuth();
  const { t, lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
        toast.success(t.auth.registerSuccess);
      } else {
        await login(username, password);
        toast.success(t.auth.loginSuccess);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || t.general.error;
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-cyber-950/20 pointer-events-none" />

      {/* Top-right controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="flex items-center gap-1 border border-gray-700/50 rounded-md p-0.5">
          <Globe size={12} className="text-gray-500 ml-1.5" />
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                lang === l.code ? 'bg-cyber-500/20 text-cyber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-sm p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-xl overflow-hidden mb-4"
              style={{
                border: '2px solid rgba(20,184,166,0.5)',
                boxShadow: '0 0 20px rgba(20,184,166,0.3)',
              }}
            >
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-bold text-white text-xl">DNS Spoofing Lab</h1>
            <p className="font-mono text-xs text-cyber-400/80 mt-1">Attack Simulation & Mitigation</p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-6 border border-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-md text-sm font-mono transition-all ${
                !isRegister ? 'bg-cyber-500/20 text-cyber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.auth.login}
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-md text-sm font-mono transition-all ${
                isRegister ? 'bg-cyber-500/20 text-cyber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.auth.register}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.username}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={t.auth.usernamePlaceholder}
              autoComplete="username"
            />
            <Input
              label={t.auth.password}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.auth.passwordPlaceholder}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={loading}
              className="w-full"
            >
              <Shield size={15} />
              {isRegister ? t.auth.register : t.auth.login}
            </Button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-gray-500 font-mono mt-6">
            {isRegister ? t.auth.haveAccount : t.auth.noAccount}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-cyber-400 hover:text-cyber-300 transition-colors"
            >
              {isRegister ? t.auth.login : t.auth.register}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
