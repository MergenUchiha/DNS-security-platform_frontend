import { useEffect, useState } from 'react';
import { Play, Square, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import MetricsPanel from './Dashboard/MetricsPanel';
import LiveTrafficMonitor from './Dashboard/LiveTrafficMonitor';
import { mitigationAPI } from '../services/api';
import websocketService from '../services/websocket';
import type { SecurityMetrics, DNSQuery } from '../types';
import SimpleNetworkGraph from './SimulationLab/SimpleNetworkGraph';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const HybridDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recentQueries, setRecentQueries] = useState<DNSQuery[]>([]);
  const [mode, setMode] = useState<'simulation' | 'real' | 'both'>('both');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    loadMonitoringStatus();
    websocketService.connect();

    const handleMetricsUpdate = (data: SecurityMetrics) => {
      console.log('📊 Metrics update received:', data);
      setMetrics(data);
    };

    const handleDNSQuery = (query: DNSQuery) => {
      console.log('🔍 DNS query received:', query);
      setRecentQueries((prev) => [query, ...prev].slice(0, 50));
    };

    websocketService.onMetricsUpdate(handleMetricsUpdate);
    websocketService.onDNSQuery(handleDNSQuery);

    return () => {
      websocketService.offMetricsUpdate(handleMetricsUpdate);
      websocketService.offDNSQuery(handleDNSQuery);
    };
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await mitigationAPI.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('❌ Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoringStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/dns-monitor/status`);
      setMonitoringStatus(response.data);
      setIsMonitoring(response.data.isMonitoring);
    } catch (error) {
      console.error('Failed to load monitoring status:', error);
    }
  };

  const startMonitoring = async () => {
    try {
      toast.loading('Starting DNS monitoring...', { id: 'monitor' });
      
      const domains = ['google.com', 'cloudflare.com', 'github.com'];
      await axios.post(`${API_URL}/dns-monitor/start`, { domains });
      
      setIsMonitoring(true);
      toast.success('DNS monitoring started!', { id: 'monitor' });
      
      await loadMonitoringStatus();
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      toast.error('Failed to start monitoring', { id: 'monitor' });
    }
  };

  const stopMonitoring = async () => {
    try {
      toast.loading('Stopping DNS monitoring...', { id: 'monitor' });
      
      await axios.post(`${API_URL}/dns-monitor/stop`);
      
      setIsMonitoring(false);
      toast.success('DNS monitoring stopped', { id: 'monitor' });
      
      await loadMonitoringStatus();
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
      toast.error('Failed to stop monitoring', { id: 'monitor' });
    }
  };

  // Filter queries by mode
  const filteredQueries = recentQueries.filter(q => {
    if (mode === 'simulation') return q.simulationId !== null && q.simulationId !== undefined;
    if (mode === 'real') return q.simulationId === null || q.simulationId === undefined;
    return true; // both
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Hybrid Dashboard</h2>
          <p className="text-gray-400">Monitor both simulated and real DNS traffic</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mode Selector */}
          <div className="glass rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setMode('simulation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'simulation'
                  ? 'bg-cyber-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => setMode('real')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'real'
                  ? 'bg-cyber-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Real Traffic
            </button>
            <button
              onClick={() => setMode('both')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'both'
                  ? 'bg-cyber-purple text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Both
            </button>
          </div>

          {/* Monitoring Control */}
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-cyber-green hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop Monitoring</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Monitoring</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monitoring Status */}
      {monitoringStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-cyber-green animate-pulse' : 'bg-gray-500'}`} />
              <div>
                <p className="text-white font-medium">
                  {isMonitoring ? 'DNS Monitoring Active' : 'DNS Monitoring Inactive'}
                </p>
                <p className="text-xs text-gray-400">
                  {monitoringStatus.domainsCount} domains monitored
                </p>
              </div>
            </div>
            
            {monitoringStatus.monitoredDomains.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {monitoringStatus.monitoredDomains.map((domain: string) => (
                  <span
                    key={domain}
                    className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mode Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <Activity className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400">Showing:</span>
        <span className={`font-medium ${
          mode === 'simulation' ? 'text-cyber-blue' :
          mode === 'real' ? 'text-cyber-green' :
          'text-cyber-purple'
        }`}>
          {mode === 'simulation' ? 'Simulated Traffic Only' :
           mode === 'real' ? 'Real Traffic Only' :
           'All Traffic'}
        </span>
        <span className="text-gray-500">({filteredQueries.length} queries)</span>
      </div>

      <MetricsPanel metrics={metrics} />

      <div className="grid grid-cols-1 gap-6">
        <SimpleNetworkGraph queries={filteredQueries} />
        <LiveTrafficMonitor queries={filteredQueries} />
      </div>
    </div>
  );
};

export default HybridDashboard;