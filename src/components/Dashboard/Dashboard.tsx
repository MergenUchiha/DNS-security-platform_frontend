import { useEffect, useState } from 'react';
import MetricsPanel from './MetricsPanel';
import LiveTrafficMonitor from './LiveTrafficMonitor';
import { mitigationAPI } from '../../services/api';
import websocketService from '../../services/websocket';
import type { SecurityMetrics, DNSQuery } from '../../types';
import SimpleNetworkGraph from '../SimulationLab/SimpleNetworkGraph';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recentQueries, setRecentQueries] = useState<DNSQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    websocketService.connect();

    const handleMetricsUpdate = (data: SecurityMetrics) => {
      console.log('📊 Metrics update received:', data);
      setMetrics(data);
    };
    

    const handleDNSQuery = (query: DNSQuery) => {
      
      console.log('🔍 DNS query received:', query);
      setRecentQueries((prev) => {
        const updated = [query, ...prev].slice(0, 50);
        return updated;
      });
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
      console.log('✅ Metrics loaded:', data);
      setMetrics(data);
    } catch (err) {
      console.error('❌ Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-2">Security Dashboard</h2>
        <p className="text-gray-400">Real-time monitoring of DNS traffic and security events</p>
      </div>

      <MetricsPanel metrics={metrics} />

      <div className="grid grid-cols-1 gap-6">
        <SimpleNetworkGraph queries={recentQueries} />
        <LiveTrafficMonitor queries={recentQueries} />
      </div>
    </div>
  );
};

export default Dashboard;