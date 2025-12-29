import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { DNSQuery } from '../../types';

const LiveTrafficMonitor = () => {
  const [queries, setQueries] = useState<DNSQuery[]>([]);

  const domains = [
    'google.com',
    'facebook.com',
    'amazon.com',
    'github.com',
    'stackoverflow.com',
    'netflix.com',
    'twitter.com',
    'linkedin.com',
  ];

  const statusConfig = {
    resolved: { icon: CheckCircle, color: 'text-cyber-green', bg: 'bg-cyber-green/20' },
    spoofed: { icon: AlertTriangle, color: 'text-cyber-pink', bg: 'bg-cyber-pink/20' },
    blocked: { icon: XCircle, color: 'text-cyber-purple', bg: 'bg-cyber-purple/20' },
    pending: { icon: Clock, color: 'text-cyber-blue', bg: 'bg-cyber-blue/20' },
  };

  // Generate random DNS queries
  useEffect(() => {
    const generateQuery = (): DNSQuery => {
      const statuses: DNSQuery['status'][] = ['resolved', 'spoofed', 'blocked', 'pending'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        domain: domains[Math.floor(Math.random() * domains.length)],
        queryType: 'A',
        sourceIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
        status,
        responseIP: status === 'resolved' ? `142.250.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : undefined,
        isSpoofed: status === 'spoofed',
      };
    };

    const interval = setInterval(() => {
      setQueries((prev) => {
        const newQuery = generateQuery();
        return [newQuery, ...prev].slice(0, 8);
      });
    }, 1500);

    // Initialize with some queries
    setQueries(Array.from({ length: 5 }, generateQuery));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Live DNS Traffic</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Real-time</span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {queries.map((query) => {
            const config = statusConfig[query.status];
            const Icon = config.icon;

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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                      {query.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(query.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveTrafficMonitor;