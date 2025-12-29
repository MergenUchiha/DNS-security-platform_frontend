import { useState, useEffect } from 'react';
import AttackCharts from './AttackCharts';
import SecurityReports from './SecurityReports';
import { analyticsAPI } from '../../services/api';
import type { AttackStatistics } from '../../types';

const Analytics = () => {
  const [statistics, setStatistics] = useState<AttackStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsAPI.getStatistics(7);
      console.log('✅ Analytics data loaded:', data);
      setStatistics(data);
    } catch (err: any) {
      console.error('❌ Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-2">Security Analytics</h2>
        <p className="text-gray-400">Comprehensive analysis of attack patterns and mitigation effectiveness</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass border-2 border-red-500/50 bg-red-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <AttackCharts statistics={statistics} />

      {/* Reports Section */}
      <SecurityReports statistics={statistics} />
    </div>
  );
};

export default Analytics;