import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Metric {
  label: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
  glowColor: string;
}

const MetricsPanel = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Total Queries',
      value: 0,
      change: 0,
      icon: Activity,
      color: 'text-cyber-blue',
      glowColor: 'glow-blue',
    },
    {
      label: 'Threats Detected',
      value: 0,
      change: 0,
      icon: AlertTriangle,
      color: 'text-cyber-pink',
      glowColor: 'glow-purple',
    },
    {
      label: 'Threats Blocked',
      value: 0,
      change: 0,
      icon: Shield,
      color: 'text-cyber-green',
      glowColor: 'glow-green',
    },
    {
      label: 'Success Rate',
      value: '0%',
      change: 0,
      icon: CheckCircle,
      color: 'text-cyber-purple',
      glowColor: 'glow-purple',
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric, idx) => {
          if (idx === 0) {
            // Total Queries
            const newValue = (metric.value as number) + Math.floor(Math.random() * 10);
            return { ...metric, value: newValue, change: Math.random() * 5 };
          } else if (idx === 1) {
            // Threats Detected
            const newValue = (metric.value as number) + (Math.random() > 0.7 ? 1 : 0);
            return { ...metric, value: newValue, change: Math.random() * 3 };
          } else if (idx === 2) {
            // Threats Blocked
            const detected = prev[1].value as number;
            const newValue = Math.floor(detected * (0.8 + Math.random() * 0.2));
            return { ...metric, value: newValue, change: Math.random() * 2 };
          } else {
            // Success Rate
            const detected = prev[1].value as number;
            const blocked = prev[2].value as number;
            const rate = detected > 0 ? ((blocked / detected) * 100).toFixed(1) : '0.0';
            return { ...metric, value: `${rate}%`, change: 0 };
          }
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => {
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
              <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color.replace('text-', 'from-')}/20 ${metric.color.replace('text-', 'to-')}/10`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              {metric.change > 0 && (
                <div className="flex items-center space-x-1 text-xs text-cyber-green">
                  <span>↑</span>
                  <span>{metric.change.toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
              <motion.p
                key={metric.value}
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