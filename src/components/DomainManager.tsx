import { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { dnsMonitorAPI } from '../services/api';

interface Props {
  domains: string[];
  onUpdate: () => void;
}

/**
 * Optional component for managing monitored domains in Hybrid Mode
 * Add this to HybridDashboard if you want UI for domain management
 */
const DomainManager = ({ domains, onUpdate }: Props) => {
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomain)) {
      toast.error('Invalid domain format');
      return;
    }

    try {
      setIsAdding(true);
      await dnsMonitorAPI.addDomain(newDomain);
      toast.success(`Added ${newDomain} to monitoring`);
      setNewDomain('');
      onUpdate();
    } catch (error) {
      toast.error('Failed to add domain');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    try {
      await dnsMonitorAPI.removeDomain(domain);
      toast.success(`Removed ${domain} from monitoring`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove domain');
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Monitored Domains</h3>
            <p className="text-sm text-gray-400">Manage domains for real-time DNS monitoring</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {domains.length} domain{domains.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Add Domain Form */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
          placeholder="example.com"
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyber-blue focus:outline-none"
          disabled={isAdding}
        />
        <button
          onClick={handleAddDomain}
          disabled={isAdding}
          className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Domain List */}
      <div className="space-y-2">
        <AnimatePresence>
          {domains.map((domain, idx) => (
            <motion.div
              key={domain}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyber-blue/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
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

      {domains.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No domains configured</p>
          <p className="text-xs mt-1">Add domains to start monitoring</p>
        </div>
      )}

      {/* Popular Domains Quick Add */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">Quick add popular domains:</p>
        <div className="flex flex-wrap gap-2">
          {['google.com', 'github.com', 'cloudflare.com', 'amazon.com', 'facebook.com'].map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setNewDomain(domain);
                // Auto-add after a short delay
                setTimeout(() => handleAddDomain(), 100);
              }}
              disabled={domains.includes(domain)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                domains.includes(domain)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/5 text-gray-300 hover:bg-cyber-blue/20 hover:text-cyber-blue'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainManager;