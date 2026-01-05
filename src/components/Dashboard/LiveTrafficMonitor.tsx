import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Clock, Activity } from 'lucide-react';
import type { DNSQuery } from '../../types';

interface Props {
  queries: DNSQuery[];
}

const LiveTrafficMonitor = ({ queries }: Props) => {
  const statusConfig = {
    resolved: { icon: CheckCircle, color: 'text-cyber-green', bg: 'bg-cyber-green/20' },
    spoofed: { icon: AlertTriangle, color: 'text-cyber-pink', bg: 'bg-cyber-pink/20' },
    blocked: { icon: XCircle, color: 'text-cyber-purple', bg: 'bg-cyber-purple/20' },
    pending: { icon: Clock, color: 'text-cyber-blue', bg: 'bg-cyber-blue/20' },
  };

  const displayQueries = queries.slice(0, 10);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Live DNS Traffic</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">
            {queries.length > 0 ? 'Active' : 'No Traffic'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {displayQueries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No DNS queries yet</p>
            <p className="text-sm mt-2">Start a simulation to see live traffic</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayQueries.map((query) => {
              const config = statusConfig[query.status];
              const Icon = config.icon;
              const timestamp =
                typeof query.timestamp === 'number'
                  ? new Date(query.timestamp)
                  : new Date(query.timestamp);

              return (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass border border-white/10 rounded-lg p-4 hover:border-cyber-blue/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-mono text-white font-medium">{query.domain}</p>
                          <p className="text-xs text-gray-400">
                            {query.sourceIP} → {query.queryType} Record
                          </p>
                        </div>
                      </div>
                      {query.responseIP && (
                        <div className="ml-11 text-xs text-gray-500">
                          Response: {query.responseIP}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.color}`}
                      >
                        {query.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LiveTrafficMonitor;