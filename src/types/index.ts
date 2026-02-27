export type LabMode = 'SAFE' | 'ATTACK' | 'MITIGATED';
export type EventType =
  | 'SESSION_STARTED' | 'SESSION_ENDED'
  | 'DNS_QUERY' | 'DNS_RESPONSE'
  | 'MODE_CHANGED' | 'LAB_RESET'
  | 'MITIGATION_POLICY_UPSERTED' | 'MITIGATION_ENABLED' | 'MITIGATION_DISABLED'
  | 'SPOOF_DETECTED' | 'SPOOF_BLOCKED' | 'SAFE_RESOLUTION_FORCED'
  | 'ERROR';

export type FinalAction = 'PASS' | 'BLOCK' | 'FORCE_SAFE_IP';

export interface LabSession {
  id: string;
  createdAt: string;
  endedAt: string | null;
  mode: LabMode;
}

export interface Event {
  id: string;
  ts: string;
  type: EventType;
  severity: 'INFO' | 'WARN' | 'ALERT';
  payload: Record<string, unknown> | null;
  sessionId: string;
}

export interface MitigationPolicy {
  id: string;
  domain: string;
  action: 'BLOCK' | 'FORCE_SAFE_IP';
  allowedIps: string[];
  sessionId: string;
}

export interface DnsQuery {
  id: string;
  ts: string;
  name: string;
  qtype: string;
  resolver: 'LEGIT' | 'SPOOF';
  answer: string | null;
  ttl: number | null;
  rttMs: number | null;
  finalAnswer: string | null;
  finalAction: FinalAction | null;
  sessionId: string;
}

export interface ResolveResult {
  sessionId: string;
  mode: LabMode;
  resolver: 'LEGIT' | 'SPOOF';
  name: string;
  type: string;
  answer: string | null;
  ttl: number | null;
  rttMs: number | null;
  finalAction: FinalAction;
  finalAnswer: string | null;
  alert: { reason: string; forcedIp?: string } | null;
}

export interface TargetUrlResult extends ResolveResult {
  targetUrl: string | null;
  mapping: { matched: boolean; by?: string; note?: string };
  reason?: string;
}

export interface LabStatus {
  session: LabSession;
  domain: string;
  policies: MitigationPolicy[];
  lastQuery: DnsQuery | null;
  stats: {
    queriesCount: number;
    spoofDetected: number;
    spoofBlocked: number;
    safeResolutionForced: number;
  };
  events: Event[];
  links: {
    docs: string;
    legitSite: string;
    fakeSite: string;
  };
}

export interface SessionSummary {
  session: LabSession;
  stats: {
    queriesCount: number;
    spoofDetected: number;
    spoofBlocked: number;
    safeResolutionForced: number;
  };
  events: Event[];
}

export interface Report {
  session: LabSession;
  summary: {
    totalQueries: number;
    spoofDetected: number;
    spoofBlocked: number;
    safeResolutionForced: number;
  };
  domains: { name: string; samples: unknown[] }[];
  events: Event[];
}

export interface DemoResult {
  sessionId: string;
  domain: string;
  steps: {
    safe: TargetUrlResult;
    attack: TargetUrlResult;
    mitigated: TargetUrlResult;
  };
  hint?: {
    legitSite: string;
    fakeSite: string;
    docs: string;
  };
}
