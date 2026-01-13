import { useEffect, useState } from 'react';
import { Shield, CheckCircle, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n';
import type { MitigationConfig } from '../../types';

interface Props {
  config: MitigationConfig | null;
  onUpdate: (updates: Partial<MitigationConfig>) => void;
}

interface ValidationResult {
  domain: string;
  status: 'valid' | 'invalid';
  timestamp: number;
}

const DNSSECValidator = ({ config, onUpdate }: Props) => {
  const { t } = useI18n();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const enabled = config?.dnssecEnabled ?? true;

  const toggleDNSSEC = async () => {
    const newState = !enabled;
    try {
      await onUpdate({ dnssecEnabled: newState });
      toast.success(`DNSSEC ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update DNSSEC setting');
    }
  };

  // Simulate validation results
  useEffect(() => {
    if (!enabled) {
      setValidationResults([]);
      return;
    }

    setValidationResults([
      { domain: 'cloudflare.com', status: 'valid', timestamp: Date.now() - 5000 },
      { domain: 'google.com', status: 'valid', timestamp: Date.now() - 15000 },
    ]);
  }, [enabled]);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-cyber-purple/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyber-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t.mitigation.dnssecValidator}</h3>
            <p className="text-sm text-gray-400">{t.mitigation.dnssecDesc}</p>
          </div>
        </div>

        <button
          onClick={toggleDNSSEC}
          className={`
            relative w-16 h-8 rounded-full transition-colors duration-300
            ${enabled ? 'bg-cyber-green' : 'bg-gray-600'}
          `}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 bg-white rounded-full"
            animate={{ left: enabled ? '36px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <div
        className={`
        p-4 rounded-lg mb-6 border-2 transition-all duration-300
        ${
          enabled
            ? 'bg-cyber-green/10 border-cyber-green/30'
            : 'bg-gray-700/10 border-gray-700/30'
        }
      `}
      >
        <div className="flex items-center space-x-3">
          {enabled ? (
            <>
              <CheckCircle className="w-6 h-6 text-cyber-green" />
              <div>
                <p className="font-medium text-cyber-green">{t.mitigation.protectionActive}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t.mitigation.protectionActiveDesc}
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-gray-500" />
              <div>
                <p className="font-medium text-gray-400">{t.mitigation.protectionDisabled}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t.mitigation.protectionDisabledDesc}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg mb-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-cyber-blue flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">{t.mitigation.howDnssecWorks}</p>
            <ul className="space-y-1 text-xs">
              <li>• {t.mitigation.validatesDns}</li>
              <li>• {t.mitigation.preventsCache}</li>
              <li>• {t.mitigation.ensuresIntegrity}</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-3">
          {t.mitigation.recentValidations} ({validationResults.length})
        </h4>
        {validationResults.length > 0 ? (
          <div className="space-y-2">
            {validationResults.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  {result.status === 'valid' ? (
                    <CheckCircle className="w-5 h-5 text-cyber-green" />
                  ) : (
                    <XCircle className="w-5 h-5 text-cyber-pink" />
                  )}
                  <div>
                    <p className="text-sm font-mono text-white">{result.domain}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${
                    result.status === 'valid'
                      ? 'bg-cyber-green/20 text-cyber-green'
                      : 'bg-cyber-pink/20 text-cyber-pink'
                  }
                `}
                >
                  {t.mitigation[result.status]}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {enabled ? t.mitigation.noValidations : t.mitigation.enableDnssec}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DNSSECValidator;