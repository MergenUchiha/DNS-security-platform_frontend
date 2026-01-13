import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n';
import { analyticsAPI } from '../../services/api';
import type { AttackStatistics } from '../../types';

interface Props {
  statistics: AttackStatistics[];
}

const SecurityReports = ({ statistics }: Props) => {
  const { t } = useI18n();

  // Calculate summary statistics
  const totalAttacks = statistics.reduce((sum, s) => sum + s.total, 0);
  const totalBlocked = statistics.reduce((sum, s) => sum + s.blocked, 0);
  const totalSuccessful = statistics.reduce((sum, s) => sum + s.successful, 0);

  const mitigationRate = totalAttacks > 0 ? (totalBlocked / totalAttacks) * 100 : 0;

  // Calculate trends (compare last half vs first half)
  const midPoint = Math.floor(statistics.length / 2);
  const firstHalf = statistics.slice(0, midPoint);
  const secondHalf = statistics.slice(midPoint);

  const firstHalfTotal = firstHalf.reduce((sum, s) => sum + s.total, 0);
  const secondHalfTotal = secondHalf.reduce((sum, s) => sum + s.total, 0);

  const attackTrend =
    firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0;

  const stats = [
    {
      label: t.analytics.totalAttacksDetected,
      value: totalAttacks.toLocaleString(),
      change: `${attackTrend > 0 ? '+' : ''}${attackTrend.toFixed(1)}%`,
      trend: attackTrend >= 0 ? 'up' : 'down',
      color: 'text-cyber-blue',
    },
    {
      label: t.analytics.mitigationSuccessRate,
      value: `${mitigationRate.toFixed(1)}%`,
      change: mitigationRate > 90 ? `+${t.analytics.high}` : t.analytics.medium,
      trend: mitigationRate > 90 ? 'up' : 'down',
      color: 'text-cyber-green',
    },
    {
      label: t.analytics.totalBlocked,
      value: totalBlocked.toLocaleString(),
      change: `${((totalBlocked / (totalAttacks || 1)) * 100).toFixed(1)}%`,
      trend: 'up',
      color: 'text-cyber-purple',
    },
    {
      label: t.analytics.successfulAttacks,
      value: totalSuccessful.toLocaleString(),
      change: `${((totalSuccessful / (totalAttacks || 1)) * 100).toFixed(1)}%`,
      trend: 'down',
      color: 'text-cyber-pink',
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      toast.loading(`Exporting ${format.toUpperCase()} report...`, { id: 'export' });
      const blob = await analyticsAPI.exportReport(format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dns-security-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${format.toUpperCase()} report exported successfully!`, { id: 'export' });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export ${format.toUpperCase()} report`, { id: 'export' });
    }
  };

  if (statistics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <div
                className={`flex items-center space-x-1 text-xs ${
                  stat.trend === 'up' ? 'text-cyber-green' : 'text-cyber-pink'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Export Section */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">{t.analytics.exportReports}</h3>
            <p className="text-sm text-gray-400 mt-1">{t.analytics.downloadReports}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t.analytics.exportPdf}</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/80 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t.analytics.exportCsv}</span>
            </button>
          </div>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-400 mb-1">{t.analytics.timePeriod}</p>
            <p className="text-lg font-semibold text-white">{statistics.length} {t.analytics.days}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-400 mb-1">{t.analytics.averageDailyAttacks}</p>
            <p className="text-lg font-semibold text-white">
              {(totalAttacks / statistics.length).toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-400 mb-1">{t.analytics.blockRate}</p>
            <p className="text-lg font-semibold text-white">{mitigationRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReports;