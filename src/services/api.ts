import axios, { AxiosError } from 'axios';
import type { 
  AttackConfig, 
  SimulationResult, 
  MitigationConfig, 
  SecurityMetrics,
  AttackStatistics 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('❌ API Error: No response received', error.request);
    } else {
      console.error('❌ API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Simulation API
export const simulationAPI = {
  start: async (config: AttackConfig): Promise<SimulationResult> => {
    try {
      const { data } = await api.post('/simulation/start', {
        type: config.type,
        targetDomain: config.targetDomain,
        spoofedIP: config.spoofedIP,
        intensity: config.intensity,
        duration: config.duration,
      });
      return data;
    } catch (error) {
      console.error('Failed to start simulation:', error);
      throw error;
    }
  },
  
  stop: async (id: string): Promise<SimulationResult> => {
    try {
      const { data } = await api.post(`/simulation/${id}/stop`);
      return data;
    } catch (error) {
      console.error('Failed to stop simulation:', error);
      throw error;
    }
  },
  
  getStatus: async (id: string): Promise<SimulationResult> => {
    try {
      const { data } = await api.get(`/simulation/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to get simulation status:', error);
      throw error;
    }
  },
  
  getAll: async (): Promise<SimulationResult[]> => {
    try {
      const { data } = await api.get('/simulation');
      return data;
    } catch (error) {
      console.error('Failed to get simulations:', error);
      throw error;
    }
  },
};

// Mitigation API
export const mitigationAPI = {
  getConfig: async (): Promise<MitigationConfig> => {
    try {
      const { data } = await api.get('/mitigation/config');
      return data;
    } catch (error) {
      console.error('Failed to get mitigation config:', error);
      throw error;
    }
  },
  
  updateConfig: async (config: Partial<MitigationConfig>): Promise<MitigationConfig> => {
    try {
      const { data } = await api.put('/mitigation/config', config);
      return data;
    } catch (error) {
      console.error('Failed to update mitigation config:', error);
      throw error;
    }
  },
  
  getMetrics: async (): Promise<SecurityMetrics> => {
    try {
      const { data } = await api.get('/mitigation/metrics');
      return data;
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      throw error;
    }
  },
};

// Analytics API
export const analyticsAPI = {
  getStatistics: async (days: number = 7): Promise<AttackStatistics[]> => {
    try {
      const { data } = await api.get(`/analytics/statistics?days=${days}`);
      return data;
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  },
  
  exportReport: async (format: 'pdf' | 'csv'): Promise<Blob> => {
    try {
      const { data } = await api.get(`/analytics/export?format=${format}`, {
        responseType: 'blob',
      });
      return data;
    } catch (error) {
      console.error('Failed to export report:', error);
      throw error;
    }
  },
};

// DNS Monitor API (Hybrid Mode)
export const dnsMonitorAPI = {
  /**
   * Start DNS monitoring for real traffic
   */
  start: async (domains?: string[]) => {
    try {
      const payload = domains && domains.length > 0 ? { domains } : { domains: [] };
      const { data } = await api.post('/dns-monitor/start', payload);
      console.log('✅ DNS monitoring started:', data);
      return data;
    } catch (error) {
      console.error('Failed to start DNS monitoring:', error);
      throw error;
    }
  },

  /**
   * Stop DNS monitoring
   */
  stop: async () => {
    try {
      const { data } = await api.post('/dns-monitor/stop');
      console.log('✅ DNS monitoring stopped:', data);
      return data;
    } catch (error) {
      console.error('Failed to stop DNS monitoring:', error);
      throw error;
    }
  },

  /**
   * Get current monitoring status
   */
  getStatus: async () => {
    try {
      const { data } = await api.get('/dns-monitor/status');
      return data;
    } catch (error) {
      console.error('Failed to get DNS monitoring status:', error);
      throw error;
    }
  },

  /**
   * Get real traffic statistics
   */
  getStats: async () => {
    try {
      const { data } = await api.get('/dns-monitor/stats');
      return data;
    } catch (error) {
      console.error('Failed to get DNS monitoring stats:', error);
      throw error;
    }
  },

  /**
   * Add domain to monitoring list
   */
  addDomain: async (domain: string) => {
    try {
      const { data } = await api.post('/dns-monitor/domain', { domain });
      console.log(`✅ Domain ${domain} added to monitoring`);
      return data;
    } catch (error) {
      console.error(`Failed to add domain ${domain}:`, error);
      throw error;
    }
  },

  /**
   * Remove domain from monitoring list
   */
  removeDomain: async (domain: string) => {
    try {
      const { data } = await api.delete(`/dns-monitor/domain/${domain}`);
      console.log(`✅ Domain ${domain} removed from monitoring`);
      return data;
    } catch (error) {
      console.error(`Failed to remove domain ${domain}:`, error);
      throw error;
    }
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/');
    return true;
  } catch (error) {
    console.error('Backend is not reachable:', error);
    return false;
  }
};

export default api;