export type Language = 'en' | 'ru' | 'tk';

export interface Translation {
  // Navigation
  nav: {
    dashboard: string;
    simulation: string;
    mitigation: string;
    analytics: string;
    about: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    totalQueries: string;
    threatsDetected: string;
    threatsBlocked: string;
    uptime: string;
    networkTopology: string;
    liveDnsTraffic: string;
    active: string;
    noTraffic: string;
    noDnsQueries: string;
    startSimulation: string;
    client: string;
    dns: string;
    server: string;
    loadingDashboard: string;
  };
  
  // Simulation
  simulation: {
    title: string;
    subtitle: string;
    attackConfiguration: string;
    launchAttack: string;
    stopAttack: string;
    attackRunning: string;
    attackType: string;
    targetDomain: string;
    spoofedIP: string;
    attackIntensity: string;
    duration: string;
    seconds: string;
    quickPresets: string;
    attackInProgress: string;
    attackNeutralized: string;
    simulationStopped: string;
    remaining: string;
    attacker: string;
    dnsServer: string;
    processing: string;
    defenseSystem: string;
    dnssecFirewall: string;
    target: string;
    totalQueries: string;
    spoofedAttacks: string;
    blocked: string;
    successRate: string;
    readyToSimulate: string;
    launchAttackDesc: string;
    attacks: {
      dns_cache_poisoning: string;
      dns_cache_poisoning_desc: string;
      man_in_the_middle: string;
      man_in_the_middle_desc: string;
      local_dns_hijack: string;
      local_dns_hijack_desc: string;
      rogue_dns_server: string;
      rogue_dns_server_desc: string;
    };
    intensity: {
      low: string;
      medium: string;
      high: string;
    };
    warnings: {
      simulation: string;
      minDuration: string;
    };
  };
  
  // Mitigation
  mitigation: {
    title: string;
    subtitle: string;
    dnssecValidator: string;
    dnssecDesc: string;
    firewallRules: string;
    firewallDesc: string;
    protectionActive: string;
    protectionActiveDesc: string;
    protectionDisabled: string;
    protectionDisabledDesc: string;
    howDnssecWorks: string;
    validatesDns: string;
    preventsCache: string;
    ensuresIntegrity: string;
    recentValidations: string;
    noValidations: string;
    enableDnssec: string;
    addRule: string;
    newFirewallRule: string;
    ruleType: string;
    block: string;
    allow: string;
    targetIpDomain: string;
    description: string;
    saveRule: string;
    cancel: string;
    noRulesConfigured: string;
    loadingConfig: string;
    valid: string;
    invalid: string;
  };
  
  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    timeRange: string;
    last7days: string;
    last14days: string;
    last30days: string;
    attackTimeline: string;
    days: string;
    totalAttacks: string;
    attackTypesDistribution: string;
    successVsBlocked: string;
    cachePoisoning: string;
    mitm: string;
    dnsHijack: string;
    rogueServer: string;
    totalAttacksDetected: string;
    mitigationSuccessRate: string;
    totalBlocked: string;
    successfulAttacks: string;
    high: string;
    medium: string;
    exportReports: string;
    downloadReports: string;
    exportPdf: string;
    exportCsv: string;
    timePeriod: string;
    averageDailyAttacks: string;
    blockRate: string;
    noAnalyticsData: string;
    runSimulations: string;
    loadingAnalytics: string;
  };
  
  // About
  about: {
    title: string;
    subtitle: string;
    aboutProject: string;
    projectDesc1: string;
    projectDesc2: string;
    attackSimulation: string;
    attackSimulationDesc: string;
    realtimeMonitoring: string;
    realtimeMonitoringDesc: string;
    protectionMechanisms: string;
    protectionMechanismsDesc: string;
    techStack: string;
    frontend: string;
    backend: string;
    keyFeatures: string;
    author: string;
    student: string;
    diplomaProject: string;
    email: string;
    footer: string;
    footerWarning: string;
    features: string[];
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
    yes: string;
    no: string;
  };
}