import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MitigationConfig } from '../../types';

interface FirewallRule {
  id: string;
  type: 'allow' | 'block';
  target: string;
  description: string;
  enabled: boolean;
}

interface Props {
  config: MitigationConfig | null;
  onUpdate: (updates: Partial<MitigationConfig>) => void;
}

const FirewallRules = ({ config, onUpdate }: Props) => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [newRule, setNewRule] = useState({
    type: 'block' as 'allow' | 'block',
    target: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize rules from config
  useEffect(() => {
    if (config) {
      const initialRules: FirewallRule[] = [
        ...config.ipWhitelist.map((ip, idx) => ({
          id: `whitelist-${idx}`,
          type: 'allow' as const,
          target: ip,
          description: 'Whitelisted IP',
          enabled: true,
        })),
        ...config.ipBlacklist.map((ip, idx) => ({
          id: `blacklist-${idx}`,
          type: 'block' as const,
          target: ip,
          description: 'Blacklisted IP',
          enabled: true,
        })),
      ];
      setRules(initialRules);
    }
  }, [config]);

  const addRule = () => {
    if (!newRule.target) return;

    const rule: FirewallRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    };

    const updatedRules = [...rules, rule];
    setRules(updatedRules);
    
    // Update backend
    syncRulesToBackend(updatedRules);
    
    setNewRule({ type: 'block', target: '', description: '' });
    setShowAddForm(false);
  };

  const deleteRule = (id: string) => {
    const updatedRules = rules.filter((r) => r.id !== id);
    setRules(updatedRules);
    syncRulesToBackend(updatedRules);
  };

  const toggleRule = (id: string) => {
    const updatedRules = rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setRules(updatedRules);
    syncRulesToBackend(updatedRules);
  };

  const syncRulesToBackend = (updatedRules: FirewallRule[]) => {
    const whitelist = updatedRules.filter(r => r.type === 'allow' && r.enabled).map(r => r.target);
    const blacklist = updatedRules.filter(r => r.type === 'block' && r.enabled).map(r => r.target);
    
    onUpdate({
      ipWhitelist: whitelist,
      ipBlacklist: blacklist,
    });
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-cyber-pink/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyber-pink" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Firewall Rules</h3>
            <p className="text-sm text-gray-400">IP and domain filtering configuration</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Add Rule Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <h4 className="text-sm font-medium text-white mb-3">New Firewall Rule</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rule Type</label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as 'allow' | 'block' })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyber-blue focus:outline-none"
                  >
                    <option value="block">Block</option>
                    <option value="allow">Allow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Target (IP/Domain)</label>
                  <input
                    type="text"
                    value={newRule.target}
                    onChange={(e) => setNewRule({ ...newRule, target: e.target.value })}
                    placeholder="192.168.1.1 or *.example.com"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyber-blue focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Brief description of this rule"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyber-blue focus:outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={addRule}
                  className="flex items-center space-x-2 px-4 py-2 bg-cyber-green text-white rounded-lg hover:bg-cyber-green/80 transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Rule</span>
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules List */}
      <div className="space-y-2">
        <AnimatePresence>
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${rule.enabled 
                  ? 'bg-white/5 border-white/10 hover:border-cyber-blue/50' 
                  : 'bg-white/5 border-white/5 opacity-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-300
                      ${rule.enabled ? 'bg-cyber-green' : 'bg-gray-600'}
                    `}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: rule.enabled ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`
                        px-2 py-0.5 rounded text-xs font-medium
                        ${rule.type === 'block' 
                          ? 'bg-cyber-pink/20 text-cyber-pink' 
                          : 'bg-cyber-green/20 text-cyber-green'
                        }
                      `}>
                        {rule.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-white text-sm">{rule.target}</span>
                    </div>
                    <p className="text-xs text-gray-400">{rule.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-cyber-pink hover:bg-cyber-pink/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No firewall rules configured</p>
        </div>
      )}
    </div>
  );
};

export default FirewallRules;