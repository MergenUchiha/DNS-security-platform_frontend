import { useEffect, useState } from 'react';
import { Play, Square, Activity, Shield, Info, Plus, Trash2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MetricsPanel from './Dashboard/MetricsPanel';
import LiveTrafficMonitor from './Dashboard/LiveTrafficMonitor';
import { mitigationAPI, dnsMonitorAPI } from '../services/api';
import websocketService from '../services/websocket';
import type { SecurityMetrics, DNSQuery } from '../types';
import SimpleNetworkGraph from './SimulationLab/SimpleNetworkGraph';

const HybridDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recentQueries, setRecentQueries] = useState<DNSQuery[]>([]);
  const [mode, setMode] = useState<'simulation' | 'real' | 'both'>('both');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Domain management
  const [showDomainManager, setShowDomainManager] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);

  useEffect(() => {
    loadMetrics();
    loadMonitoringStatus();
    websocketService.connect();

    const handleMetricsUpdate = (data: SecurityMetrics) => {
      console.log('📊 [HYBRID] Metrics update received:', data);
      setMetrics(data);
    };

    const handleDNSQuery = (query: DNSQuery) => {
      console.log('🔍 [HYBRID] DNS query received:', query);
      setRecentQueries((prev) => [query, ...prev].slice(0, 100));
    };

    websocketService.onMetricsUpdate(handleMetricsUpdate);
    websocketService.onDNSQuery(handleDNSQuery);

    // Poll stats every 5 seconds if monitoring
    const statsInterval = setInterval(() => {
      if (isMonitoring) {
        loadStats();
      }
    }, 5000);

    return () => {
      websocketService.offMetricsUpdate(handleMetricsUpdate);
      websocketService.offDNSQuery(handleDNSQuery);
      clearInterval(statsInterval);
    };
  }, [isMonitoring]);

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
      const status = await dnsMonitorAPI.getStatus();
      setMonitoringStatus(status);
      setIsMonitoring(status.isMonitoring);
      console.log('✅ [HYBRID] Monitoring status loaded:', status);
    } catch (error) {
      console.error('❌ Failed to load monitoring status:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await dnsMonitorAPI.getStats();
      setStats(data);
      console.log('📊 [HYBRID] Stats loaded:', data);
    } catch (error) {
      console.error('❌ Failed to load stats:', error);
    }
  };

  const startMonitoring = async () => {
    try {
      toast.loading('Starting DNS monitoring...', { id: 'monitor' });
      
      const domains = monitoringStatus?.monitoredDomains || ['google.com', 'cloudflare.com', 'github.com'];
      await dnsMonitorAPI.start(domains);
      
      setIsMonitoring(true);
      toast.success('DNS monitoring started! Real traffic will appear soon.', { id: 'monitor' });
      
      await loadMonitoringStatus();
      await loadStats();
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      toast.error('Failed to start monitoring', { id: 'monitor' });
    }
  };

  const stopMonitoring = async () => {
    try {
      toast.loading('Stopping DNS monitoring...', { id: 'monitor' });
      
      await dnsMonitorAPI.stop();
      
      setIsMonitoring(false);
      toast.success('DNS monitoring stopped', { id: 'monitor' });
      
      await loadMonitoringStatus();
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
      toast.error('Failed to stop monitoring', { id: 'monitor' });
    }
  };

  // Domain Management Functions
  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomain)) {
      toast.error('Invalid domain format (example: google.com)');
      return;
    }

    // Check if already exists
    if (monitoringStatus?.monitoredDomains?.includes(newDomain)) {
      toast.error(`${newDomain} is already being monitored`);
      return;
    }

    try {
      setIsAddingDomain(true);
      await dnsMonitorAPI.addDomain(newDomain);
      toast.success(`Added ${newDomain} to monitoring`);
      setNewDomain('');
      await loadMonitoringStatus();
    } catch (error) {
      toast.error('Failed to add domain');
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    try {
      await dnsMonitorAPI.removeDomain(domain);
      toast.success(`Removed ${domain} from monitoring`);
      await loadMonitoringStatus();
    } catch (error) {
      toast.error('Failed to remove domain');
    }
  };

  const handleQuickAddDomain = (domain: string) => {
    if (monitoringStatus?.monitoredDomains?.includes(domain)) {
      toast.error(`${domain} is already being monitored`);
      return;
    }
    setNewDomain(domain);
    setTimeout(() => handleAddDomain(), 100);
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
          <p className="text-gray-400">Loading Hybrid Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">🔬 Hybrid Dashboard</h2>
          <p className="text-gray-400">Monitor both simulated attacks and real DNS traffic simultaneously</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mode Selector */}
          <div className="glass rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setMode('simulation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'simulation'
                  ? 'bg-cyber-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎮 Simulation
            </button>
            <button
              onClick={() => setMode('real')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'real'
                  ? 'bg-cyber-green text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🌐 Real Traffic
            </button>
            <button
              onClick={() => setMode('both')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'both'
                  ? 'bg-cyber-purple text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚡ Both
            </button>
          </div>

          {/* Monitoring Control */}
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-cyber-green hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Square className="w-5 h-5" />
                <span>Stop Real Monitoring</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Real Monitoring</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 border-2 border-cyber-blue/30 bg-cyber-blue/5"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-cyber-blue flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">How Hybrid Mode Works</h4>
            <p className="text-sm text-gray-300">
              Hybrid Mode allows you to monitor <strong>real DNS queries</strong> from your system alongside 
              <strong> simulated attacks</strong>. Real queries have <code className="px-1 py-0.5 bg-white/10 rounded">simulationId = null</code>, 
              while simulated attacks include a simulationId. Switch between modes to compare behavior.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Monitoring Status */}
      {monitoringStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${isMonitoring ? 'bg-cyber-green animate-pulse' : 'bg-gray-500'}`} />
              <div>
                <p className="text-white font-semibold text-lg">
                  {isMonitoring ? '🟢 DNS Monitoring Active' : '⚫ DNS Monitoring Inactive'}
                </p>
                <p className="text-sm text-gray-400">
                  {monitoringStatus.domainsCount > 0 
                    ? `Monitoring ${monitoringStatus.domainsCount} domains` 
                    : 'No domains configured'}
                </p>
              </div>
            </div>
            
            {/* Manage Domains Button */}
            <button
              onClick={() => setShowDomainManager(!showDomainManager)}
              className="flex items-center space-x-2 px-4 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/80 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Manage Domains</span>
            </button>
          </div>

          {/* Real-time Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyber-blue">{stats.totalQueries}</p>
                <p className="text-xs text-gray-400 mt-1">Total Queries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyber-green">{stats.blockedQueries}</p>
                <p className="text-xs text-gray-400 mt-1">Blocked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyber-pink">{stats.spoofedQueries}</p>
                <p className="text-xs text-gray-400 mt-1">Spoofed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyber-purple">{stats.avgResponseTime.toFixed(0)}ms</p>
                <p className="text-xs text-gray-400 mt-1">Avg Response</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.blockRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 mt-1">Block Rate</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Domain Manager Panel */}
      <AnimatePresence>
        {showDomainManager && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Domain Management</h3>
                  <p className="text-sm text-gray-400">Add or remove domains for real-time monitoring</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {monitoringStatus?.domainsCount || 0} domain{(monitoringStatus?.domainsCount || 0) !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Add Domain Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Add New Domain</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                  placeholder="example.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyber-blue focus:outline-none"
                  disabled={isAddingDomain}
                />
                <button
                  onClick={handleAddDomain}
                  disabled={isAddingDomain || !newDomain.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Enter domain without http:// or www. (e.g., google.com)
              </p>
            </div>

            {/* Popular Domains Quick Add */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Quick add popular domains:</p>
              <div className="flex flex-wrap gap-2">
                {['google.com', 'github.com', 'cloudflare.com', 'amazon.com', 'facebook.com', 'twitter.com', 'reddit.com', 'stackoverflow.com'].map((domain) => {
                  const isAdded = monitoringStatus?.monitoredDomains?.includes(domain);
                  return (
                    <button
                      key={domain}
                      onClick={() => !isAdded && handleQuickAddDomain(domain)}
                      disabled={isAdded}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isAdded
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-white/5 text-gray-300 hover:bg-cyber-blue/20 hover:text-cyber-blue border border-white/10 hover:border-cyber-blue/50'
                      }`}
                    >
                      {isAdded ? '✓ ' : '+ '}{domain}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Domain List */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Currently monitored domains:</p>
              {monitoringStatus?.monitoredDomains?.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {monitoringStatus.monitoredDomains.map((domain: string, idx: number) => (
                      <motion.div
                        key={domain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyber-blue/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-cyber-green animate-pulse' : 'bg-gray-500'}`} />
                          <span className="font-mono text-white text-sm">{domain}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveDomain(domain)}
                          className="p-2 text-cyber-pink hover:bg-cyber-pink/20 rounded-lg transition-colors"
                          title="Remove domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                  <Globe className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-gray-400">No domains configured yet</p>
                  <p className="text-xs text-gray-500 mt-1">Add domains above to start monitoring</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <Activity className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400">Current View:</span>
        <span className={`font-semibold ${
          mode === 'simulation' ? 'text-cyber-blue' :
          mode === 'real' ? 'text-cyber-green' :
          'text-cyber-purple'
        }`}>
          {mode === 'simulation' ? '🎮 Simulated Attacks Only' :
           mode === 'real' ? '🌐 Real DNS Traffic Only' :
           '⚡ All Traffic (Simulation + Real)'}
        </span>
        <span className="text-gray-500">({filteredQueries.length} queries)</span>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel metrics={metrics} />

      {/* Visualizations */}
      <div className="grid grid-cols-1 gap-6">
        <SimpleNetworkGraph queries={filteredQueries} />
        <LiveTrafficMonitor queries={filteredQueries} />
      </div>

      {/* Empty State */}
      {filteredQueries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Traffic to Display</h3>
          <p className="text-gray-400 mb-6">
            {mode === 'simulation' ? 'Run a simulation in the Simulation Lab to see attack traffic' :
             mode === 'real' ? 'Start DNS monitoring to see real network traffic' :
             'Start monitoring or run a simulation to see traffic'}
          </p>
          <div className="flex items-center justify-center space-x-4">
            {!isMonitoring && mode !== 'simulation' && (
              <button
                onClick={startMonitoring}
                className="px-6 py-3 bg-cyber-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Real Monitoring
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HybridDashboard;