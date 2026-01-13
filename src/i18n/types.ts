export type Language = 'en' | 'ru' | 'tk';

export interface Translation {
  // Navigation
  nav: {
    dashboard: string;
    simulation: string;
    analytics: string;
    settings: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    activeThreats: string;
    queriesPerSecond: string;
    mitigationRate: string;
    systemHealth: string;
    realtimeMonitoring: string;
    threatDistribution: string;
    performanceMetrics: string;
    recentAttacks: string;
    attackType: string;
    severity: string;
    status: string;
    time: string;
    high: string;
    medium: string;
    low: string;
    active: string;
    mitigated: string;
    blocked: string;
  };
  
  // Simulation
  simulation: {
    title: string;
    subtitle: string;
    selectAttack: string;
    attackIntensity: string;
    duration: string;
    seconds: string;
    targetDomain: string;
    startSimulation: string;
    stopSimulation: string;
    running: string;
    results: string;
    totalRequests: string;
    blockedRequests: string;
    successRate: string;
    avgResponseTime: string;
    attacks: {
      flood: string;
      amplification: string;
      tunneling: string;
      poisoning: string;
      spoofing: string;
    };
    intensity: {
      low: string;
      medium: string;
      high: string;
    };
  };
  
  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    overview: string;
    timeRange: string;
    last24h: string;
    last7d: string;
    last30d: string;
    threatTrends: string;
    geographicDistribution: string;
    protocolAnalysis: string;
    topTargets: string;
    requests: string;
    blocked: string;
    country: string;
    protocol: string;
    percentage: string;
    domain: string;
    attacks: string;
  };
  
  // Settings
  settings: {
    title: string;
    subtitle: string;
    general: string;
    security: string;
    notifications: string;
    language: string;
    selectLanguage: string;
    theme: string;
    timezone: string;
    autoUpdate: string;
    enableAutoUpdate: string;
    threatLevel: string;
    selectThreatLevel: string;
    blockSuspicious: string;
    enableBlocking: string;
    rateLimit: string;
    maxRequests: string;
    emailAlerts: string;
    enableEmail: string;
    slackIntegration: string;
    enableSlack: string;
    saveChanges: string;
    saved: string;
    languages: {
      en: string;
      ru: string;
      tk: string;
    };
    themes: {
      dark: string;
      light: string;
      auto: string;
    };
    levels: {
      low: string;
      medium: string;
      high: string;
      critical: string;
    };
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    filter: string;
    export: string;
    refresh: string;
  };
}