// DNS Traffic Types
export interface DNSQuery {
  id: string;
  timestamp: number;
  domain: string;
  queryType: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS';
  sourceIP: string;
  status: 'pending' | 'resolved' | 'spoofed' | 'blocked';
  responseIP?: string;
  isSpoofed: boolean;
}

// Attack Types
export type AttackType = 
  | 'dns_cache_poisoning'
  | 'man_in_the_middle' 
  | 'local_dns_hijack'
  | 'rogue_dns_server';

export interface AttackConfig {
  type: AttackType;
  targetDomain: string;
  spoofedIP: string;
  intensity: 'low' | 'medium' | 'high';
  duration: number; // seconds
}

export interface SimulationResult {
  id: string;
  attackType?: AttackType;
  targetDomain?: string;
  spoofedIP?: string;
  intensity?: string;
  duration?: number;
  totalQueries?: number;
  spoofedQueries?: number;
  blockedQueries?: number;
  successRate?: number;
  config?: AttackConfig;
  startTime: number | string;
  endTime?: number | string | null;
  status: 'running' | 'completed' | 'stopped';
  metrics?: {
    totalQueries: number;
    spoofedQueries: number;
    blockedQueries: number;
    successRate: number;
  };
  timeline?: TimelineEvent[];
  queries?: any[];
  events?: any[];
}

export interface TimelineEvent {
  timestamp: number;
  type: 'query' | 'spoofed' | 'blocked' | 'resolved';
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

// Mitigation Types
export interface MitigationConfig {
  dnssecEnabled: boolean;
  firewallEnabled: boolean;
  ratelimiting: {
    enabled: boolean;
    maxQueriesPerSecond: number;
  };
  ipWhitelist: string[];
  ipBlacklist: string[];
  trustedResolvers: string[];
}

export interface SecurityMetrics {
  threatsDetected: number;
  threatsBlocked: number;
  dnssecValidations: number;
  avgResponseTime: number;
  uptime: number;
  totalQueries: number;
  maliciousQueries: number;
  legitimateQueries: number;
}

// Analytics Types
export interface AttackStatistics {
  date: string;
  total: number;
  blocked: number;
  successful: number;
  attackTypes: Record<AttackType, number>;
}

export interface VulnerabilityScore {
  overall: number;
  dnssec: number;
  firewall: number;
  monitoring: number;
  configuration: number;
}