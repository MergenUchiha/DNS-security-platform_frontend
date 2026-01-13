import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import AttackCharts from './AttackCharts';
import SecurityReports from './SecurityReports';
import { analyticsAPI } from '../../services/api';
import type { AttackStatistics } from '../../types';

const Analytics = () => {
  const { t } = useI18n();
  const [statistics, setStatistics] = useState<AttackStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadStatistics(days);
  }, [days]);

  const loadStatistics = async (daysCount: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsAPI.getStatistics(daysCount);
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
          <p className="text-gray-400">{t.analytics.loadingAnalytics}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">{t.analytics.title}</h2>
          <p className="text-gray-400">{t.analytics.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{t.analytics.timeRange}:</span>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyber-blue focus:outline-none"
          >
            <option value={7}>{t.analytics.last7days}</option>
            <option value={14}>{t.analytics.last14days}</option>
            <option value={30}>{t.analytics.last30days}</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="glass border-2 border-red-500/50 bg-red-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      <AttackCharts statistics={statistics} />
      <SecurityReports statistics={statistics} />
    </div>
  );
};

export default Analytics;