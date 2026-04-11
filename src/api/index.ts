import axios from 'axios';
import type {
  LabSession, LabStatus, SessionSummary, Report,
  ResolveResult, TargetUrlResult, MitigationPolicy, DemoResult, Event
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('dns-lab-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log errors + handle 401 (expired/invalid token)
api.interceptors.response.use(
  r => r,
  err => {
    const url = err.config?.url ?? '';
    const status = err.response?.status ?? 'network';
    const data = err.response?.data;
    console.error(`[API] ${status} ${url}`, data);

    if (status === 401 && !url.includes('/auth/')) {
      localStorage.removeItem('dns-lab-token');
      localStorage.removeItem('dns-lab-username');
      window.location.reload();
    }

    return Promise.reject(err);
  }
);

// ── Sessions ──────────────────────────────────────────────────────────────────
export const sessionsApi = {
  create: (note?: string) =>
    api.post<LabSession>('/sessions', note ? { note } : {}).then(r => r.data),

  current: () =>
    api.get<LabSession>('/sessions/current').then(r => r.data),

  end: (id: string) =>
    api.post<LabSession>(`/sessions/${id}/end`).then(r => r.data),

  summary: (id: string, eventsTake = 50) =>
    api.get<SessionSummary>(`/sessions/${id}/summary`, { params: { eventsTake } }).then(r => r.data),
};

// ── Lab ───────────────────────────────────────────────────────────────────────
export const labApi = {
  setMode: (sessionId: string, mode: string) =>
    api.post<LabSession>(`/lab/${sessionId}/mode`, { mode }).then(r => r.data),

  reset: (sessionId: string) =>
    api.post<{ ok: boolean }>(`/lab/${sessionId}/reset`).then(r => r.data),

  status: (sessionId: string, domain?: string, eventsTake?: number) => {
    const params: Record<string, unknown> = {};
    if (domain) params.domain = domain;
    if (eventsTake) params.eventsTake = eventsTake;
    return api.get<LabStatus>(`/lab/${sessionId}/status`, { params }).then(r => r.data);
  },

  bootstrap: (sessionId: string, domain?: string) =>
    api.post(`/lab/${sessionId}/bootstrap`, domain ? { domain } : {}).then(r => r.data),

  quickDemo: (sessionId: string, domain?: string, type?: string) => {
    const body: Record<string, string> = {};
    if (domain) body.domain = domain;
    if (type) body.type = type;
    return api.post(`/lab/${sessionId}/quick-demo`, body).then(r => r.data);
  },
};

// ── DNS ───────────────────────────────────────────────────────────────────────
export const dnsApi = {
  resolve: (sessionId: string, name: string, type: 'A' | 'AAAA' | 'CNAME') =>
    api.get<ResolveResult>('/dns/resolve', { params: { sessionId, name, type } }).then(r => r.data),

  targetUrl: (sessionId: string, name: string, type: 'A' | 'AAAA' | 'CNAME') =>
    api.get<TargetUrlResult>('/dns/target-url', { params: { sessionId, name, type } }).then(r => r.data),
};

// ── Mitigation ────────────────────────────────────────────────────────────────
export const mitigationApi = {
  list: (sessionId: string) =>
    api.get<MitigationPolicy[]>(`/mitigation/${sessionId}/policies`).then(r => r.data),

  upsert: (sessionId: string, data: { domain: string; action: 'BLOCK' | 'FORCE_SAFE_IP'; allowedIps: string[] }) =>
    api.put<MitigationPolicy>(`/mitigation/${sessionId}/policies`, data).then(r => r.data),
};

// ── Events ────────────────────────────────────────────────────────────────────
// Backend PaginationDto uses "take" param, must be a valid integer >= 1
export const eventsApi = {
  list: (sessionId: string, take = 100) =>
    api.get<Event[]>('/events', {
      params: { sessionId, take: Math.max(1, Math.floor(take)) },
    }).then(r => r.data),
};

// ── Report ────────────────────────────────────────────────────────────────────
export const reportApi = {
  get: (sessionId: string) =>
    api.get<Report>(`/report/${sessionId}`).then(r => r.data),
};

// ── Demo ─────────────────────────────────────────────────────────────────────
// Send only defined fields — backend validation rejects unknown/undefined
export const demoApi = {
  run: (domain?: string, type?: 'A' | 'AAAA' | 'CNAME') => {
    const body: Record<string, string> = {};
    if (domain) body.domain = domain;
    if (type)   body.type   = type;
    return api.post<DemoResult>('/demo/run', body).then(r => r.data);
  },
};

// ── Health ────────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get<{ ok: boolean; ts: string }>('/health').then(r => r.data),
};

export default api;
