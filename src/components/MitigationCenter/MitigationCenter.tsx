import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import DNSSECValidator from './DNSSECValidator';
import FirewallRules from './FirewallRules';
import { mitigationAPI } from '../../services/api';
import type { MitigationConfig } from '../../types';

const MitigationCenter = () => {
  const { t } = useI18n();
  const [config, setConfig] = useState<MitigationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mitigationAPI.getConfig();
      console.log('✅ Mitigation config loaded:', data);
      setConfig(data);
    } catch (err: any) {
      console.error('❌ Failed to load mitigation config:', err);
      setError('Failed to load configuration. Using default settings.');
      // Set default config
      setConfig({
        dnssecEnabled: true,
        firewallEnabled: true,
        ratelimiting: {
          enabled: true,
          maxQueriesPerSecond: 100,
        },
        ipWhitelist: ['8.8.8.8', '1.1.1.1'],
        ipBlacklist: [],
        trustedResolvers: ['8.8.8.8', '1.1.1.1', '208.67.222.222'],
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<MitigationConfig>) => {
    try {
      setError(null);
      const updated = await mitigationAPI.updateConfig(updates);
      console.log('✅ Mitigation config updated:', updated);
      setConfig(updated);
    } catch (err: any) {
      console.error('❌ Failed to update mitigation config:', err);
      setError('Failed to update configuration');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t.mitigation.loadingConfig}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-2">{t.mitigation.title}</h2>
        <p className="text-gray-400">{t.mitigation.subtitle}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass border-2 border-yellow-500/50 bg-yellow-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">⚠️</span>
            <p className="text-yellow-400">{error}</p>
          </div>
        </div>
      )}

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DNSSECValidator 
          config={config}
          onUpdate={updateConfig}
        />
        <FirewallRules 
          config={config}
          onUpdate={updateConfig}
        />
      </div>
    </div>
  );
};

export default MitigationCenter;