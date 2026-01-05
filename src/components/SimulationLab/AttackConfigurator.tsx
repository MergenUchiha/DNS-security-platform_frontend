import { useState } from 'react';
import { Play, Square, Zap } from 'lucide-react';
import type { AttackConfig, AttackType } from '../../types';

interface Props {
  onStart: (config: AttackConfig) => void;
  onStop: () => void;
  isRunning: boolean;
}

const AttackConfigurator = ({ onStart, onStop, isRunning }: Props) => {
  const [config, setConfig] = useState<AttackConfig>({
    type: 'dns_cache_poisoning',
    targetDomain: 'example.com',
    spoofedIP: '192.168.1.100',
    intensity: 'medium',
    duration: 60, // Default 60 seconds
  });

  const attackTypes: { value: AttackType; label: string; description: string }[] = [
    {
      value: 'dns_cache_poisoning',
      label: 'DNS Cache Poisoning',
      description: 'Inject false DNS records into cache',
    },
    {
      value: 'man_in_the_middle',
      label: 'Man-in-the-Middle',
      description: 'Intercept and modify DNS responses',
    },
    {
      value: 'local_dns_hijack',
      label: 'Local DNS Hijack',
      description: 'Override local DNS resolver settings',
    },
    {
      value: 'rogue_dns_server',
      label: 'Rogue DNS Server',
      description: 'Set up malicious DNS server',
    },
  ];

  const handleStart = () => {
    // Validate duration before sending
    if (config.duration < 10) {
      alert('Duration must be at least 10 seconds');
      return;
    }
    if (config.duration > 300) {
      alert('Duration cannot exceed 300 seconds (5 minutes)');
      return;
    }
    onStart(config);
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Attack Configuration</h3>
          <p className="text-sm text-gray-400">Configure and launch DNS spoofing simulation</p>
        </div>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-pink/20 text-cyber-pink rounded-full text-sm">
              <div className="w-2 h-2 bg-cyber-pink rounded-full animate-pulse"></div>
              <span>Attack Running</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Attack Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Attack Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attackTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setConfig({ ...config, type: type.value })}
                disabled={isRunning}
                className={`
                  text-left p-4 rounded-lg border-2 transition-all duration-300
                  ${
                    config.type === type.value
                      ? 'border-cyber-blue bg-cyber-blue/10 glow-blue'
                      : 'border-white/10 bg-white/5 hover:border-cyber-blue/50'
                  }
                  ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="font-medium text-white mb-1">{type.label}</div>
                <div className="text-xs text-gray-400">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Domain</label>
            <input
              type="text"
              value={config.targetDomain}
              onChange={(e) => setConfig({ ...config, targetDomain: e.target.value })}
              disabled={isRunning}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyber-blue focus:outline-none transition-colors disabled:opacity-50"
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spoofed IP Address
            </label>
            <input
              type="text"
              value={config.spoofedIP}
              onChange={(e) => setConfig({ ...config, spoofedIP: e.target.value })}
              disabled={isRunning}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyber-blue focus:outline-none transition-colors disabled:opacity-50"
              placeholder="192.168.1.100"
            />
          </div>
        </div>

        {/* Intensity & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attack Intensity
            </label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setConfig({ ...config, intensity: level })}
                  disabled={isRunning}
                  className={`
                    flex-1 py-3 rounded-lg font-medium transition-all duration-300
                    ${
                      config.intensity === level
                        ? 'bg-cyber-blue text-white glow-blue'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }
                    ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration: {config.duration} seconds
            </label>
            <div className="space-y-2">
              <input
                type="range"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                disabled={isRunning}
                min="10"
                max="300"
                step="10"
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyber-blue disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10s (min)</span>
                <span>300s (max)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Duration Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quick Presets</label>
          <div className="flex space-x-2">
            {[30, 60, 120, 180].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setConfig({ ...config, duration: seconds })}
                disabled={isRunning}
                className={`
                  px-4 py-2 rounded-lg text-sm transition-all duration-300
                  ${
                    config.duration === seconds
                      ? 'bg-cyber-purple text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }
                  ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 glow-blue"
            >
              <Play className="w-5 h-5" />
              <span>Launch Attack</span>
              <Zap className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-cyber-pink text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Square className="w-5 h-5" />
              <span>Stop Attack</span>
            </button>
          )}
        </div>

        {/* Info Messages */}
        <div className="space-y-2">
          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              ⚠️ This is a simulated attack in a controlled environment. No real networks or
              systems will be affected.
            </p>
          </div>

          {/* Duration Warning */}
          {config.duration < 10 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-200">
                ❌ Duration must be at least 10 seconds (currently {config.duration}s)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttackConfigurator;