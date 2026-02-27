import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LabSession } from '../types';
import { sessionsApi } from '../api';

interface SessionContextType {
  session: LabSession | null;
  setSession: (s: LabSession | null) => void;
  fetchCurrent: () => Promise<void>;
  createSession: (note?: string) => Promise<LabSession>;
  endSession: () => Promise<void>;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  setSession: () => {},
  fetchCurrent: async () => {},
  createSession: async () => ({} as LabSession),
  endSession: async () => {},
  loading: false,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LabSession | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrent = useCallback(async () => {
    setLoading(true);
    try {
      const s = await sessionsApi.current();
      setSession(s);
    } catch (err: any) {
      // 404 = no active session — that's fine, just clear state
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (note?: string) => {
    setLoading(true);
    try {
      const s = await sessionsApi.create(note);
      setSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      await sessionsApi.end(session.id);
      setSession(null);
    } catch {
      // If 404 — session already gone, clear anyway
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession, fetchCurrent, createSession, endSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
