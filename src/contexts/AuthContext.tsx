import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const TOKEN_KEY = 'dns-lab-token';
const USERNAME_KEY = 'dns-lab-username';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(USERNAME_KEY));

  const saveAuth = (t: string, u: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USERNAME_KEY, u);
    setToken(t);
    setUsername(u);
  };

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post<{ access_token: string; username: string }>('/auth/login', { username, password });
    saveAuth(res.data.access_token, res.data.username);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const res = await api.post<{ access_token: string; username: string }>('/auth/register', { username, password });
    saveAuth(res.data.access_token, res.data.username);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
