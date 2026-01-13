import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';
import type { SecurityMetrics } from '../../types';

interface Props {
  metrics: SecurityMetrics | null;
}

interface DisplayMetric {
  label: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
  glowColor: string;
}

const MetricsPanel = ({ metrics }: Props) => {
  const { t } = useI18n();
  const [previousMetrics, setPreviousMetrics] = useState<SecurityMetrics | null>(null);

  useEffect(() => {
    if (metrics && previousMetrics) {
      // Metrics updated, previous values stored for change calculation
    }
    if (metrics) {
      setPreviousMetrics(metrics);
    }
  }, [metrics]);

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const displayMetrics: DisplayMetric[] = [
    {
      label: t.dashboard.totalQueries,
      value: metrics?.totalQueries || 0,
      change: previousMetrics
        ? calculateChange(metrics?.totalQueries || 0, previousMetrics.totalQueries)
        : 0,
      icon: Activity,
      color: 'text-cyber-blue',
      glowColor: 'glow-blue',
    },
    {
      label: t.dashboard.threatsDetected,
      value: metrics?.threatsDetected || 0,
      change: previousMetrics
        ? calculateChange(metrics?.threatsDetected || 0, previousMetrics.threatsDetected)
        : 0,
      icon: AlertTriangle,
      color: 'text-cyber-pink',
      glowColor: 'glow-purple',
    },
    {
      label: t.dashboard.threatsBlocked,
      value: metrics?.threatsBlocked || 0,
      change: previousMetrics
        ? calculateChange(metrics?.threatsBlocked || 0, previousMetrics.threatsBlocked)
        : 0,
      icon: Shield,
      color: 'text-cyber-green',
      glowColor: 'glow-green',
    },
    {
      label: t.dashboard.uptime,
      value: `${(metrics?.uptime || 100).toFixed(1)}%`,
      change: 0,
      icon: CheckCircle,
      color: 'text-cyber-purple',
      glowColor: 'glow-purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayMetrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass rounded-xl p-6 ${metric.glowColor} hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${metric.color.replace(
                  'text-',
                  'from-'
                )}/20 ${metric.color.replace('text-', 'to-')}/10`}
              >
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              {metric.change !== 0 && (
                <div
                  className={`flex items-center space-x-1 text-xs ${
                    metric.change > 0 ? 'text-cyber-green' : 'text-cyber-pink'
                  }`}
                >
                  <span>{metric.change > 0 ? '↑' : '↓'}</span>
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
              <motion.p
                key={String(metric.value)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-white"
              >
                {metric.value}
              </motion.p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsPanel;