import { Download, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityReports = () => {
  const stats = [
    {
      label: 'Total Attacks Detected',
      value: '1,247',
      change: '+12.3%',
      trend: 'up',
      color: 'text-cyber-blue',
    },
    {
      label: 'Mitigation Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      color: 'text-cyber-green',
    },
    {
      label: 'Average Response Time',
      value: '12ms',
      change: '-5.4%',
      trend: 'down',
      color: 'text-cyber-purple',
    },
    {
      label: 'Critical Incidents',
      value: '3',
      change: '-50%',
      trend: 'down',
      color: 'text-cyber-pink',
    },
  ];

  const recentIncidents = [
    {
      id: 1,
      type: 'DNS Cache Poisoning',
      severity: 'high',
      timestamp: '2 hours ago',
      status: 'mitigated',
    },
    {
      id: 2,
      type: 'Man-in-the-Middle Attempt',
      severity: 'critical',
      timestamp: '5 hours ago',
      status: 'blocked',
    },
    {
      id: 3,
      type: 'Rogue DNS Server',
      severity: 'medium',
      timestamp: '1 day ago',
      status: 'monitored',
    },
  ];

  const severityColors = {
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    high: { bg: 'bg-cyber-pink/20', text: 'text-cyber-pink', border: 'border-cyber-pink/50' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    low: { bg: 'bg-cyber-blue/20', text: 'text-cyber-blue', border: 'border-cyber-blue/50' },
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    // This would call the API in real implementation
    console.log(`Exporting report as ${format}`);
  };

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
              <div className={`flex items-center space-x-1 text-xs ${
                stat.trend === 'up' ? 'text-cyber-green' : 'text-cyber-pink'
              }`}>
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

      {/* Recent Incidents */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Security Incidents</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/80 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {recentIncidents.map((incident, idx) => {
            const colors = severityColors[incident.severity as keyof typeof severityColors];
            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyber-blue/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{incident.type}</p>
                      <p className="text-sm text-gray-400">{incident.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyber-green/20 text-cyber-green">
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vulnerability Assessment */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Vulnerability Assessment</h3>
        <div className="space-y-4">
          {[
            { name: 'DNSSEC Implementation', score: 92, color: 'bg-cyber-green' },
            { name: 'Firewall Configuration', score: 85, color: 'bg-cyber-blue' },
            { name: 'Rate Limiting', score: 78, color: 'bg-yellow-500' },
            { name: 'Monitoring Coverage', score: 88, color: 'bg-cyber-purple' },
          ].map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm font-bold text-white">{item.score}/100</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityReports;