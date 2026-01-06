import api from './api';

export const dnsMonitorAPI = {
  /**
   * Start DNS monitoring
   */
  start: async (domains?: string[]) => {
    const { data } = await api.post('/dns-monitor/start', { domains });
    return data;
  },

  /**
   * Stop DNS monitoring
   */
  stop: async () => {
    const { data } = await api.post('/dns-monitor/stop');
    return data;
  },

  /**
   * Get monitoring status
   */
  getStatus: async () => {
    const { data } = await api.get('/dns-monitor/status');
    return data;
  },

  /**
   * Get real traffic statistics
   */
  getStats: async () => {
    const { data } = await api.get('/dns-monitor/stats');
    return data;
  },

  /**
   * Add domain to monitoring
   */
  addDomain: async (domain: string) => {
    const { data } = await api.post('/dns-monitor/domain', { domain });
    return data;
  },

  /**
   * Remove domain from monitoring
   */
  removeDomain: async (domain: string) => {
    const { data } = await api.delete(`/dns-monitor/domain/${domain}`);
    return data;
  },
};