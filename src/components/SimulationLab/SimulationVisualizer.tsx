import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Server, Wifi, AlertCircle } from 'lucide-react';
import type { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

const SimulationVisualizer = ({ simulation }: Props) => {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!simulation || simulation.status !== 'running') {
      return;
    }

    const startTime =
      typeof simulation.startTime === 'string'
        ? new Date(simulation.startTime).getTime()
        : simulation.startTime;

    const duration = (simulation.config?.duration || simulation.duration || 60) * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const currentProgress = Math.min((elapsedMs / duration) * 100, 100);

      setElapsed(elapsedSec);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [simulation]);

  if (!simulation) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-cyber-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-cyber-blue" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Active Simulation</h3>
        <p className="text-gray-400">Configure and launch an attack to see visualization</p>
      </div>
    );
  }

  const config = simulation.config || {
    type: simulation.attackType,
    targetDomain: simulation.targetDomain,
    spoofedIP: simulation.spoofedIP,
    intensity: simulation.intensity,
    duration: simulation.duration,
  };

  const duration = config.duration || 60;
  const remaining = Math.max(0, duration - elapsed);

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Attack Visualization</h3>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                simulation.status === 'running'
                  ? 'bg-cyber-pink/20 text-cyber-pink'
                  : simulation.status === 'completed'
                  ? 'bg-cyber-green/20 text-cyber-green'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {simulation.status.toUpperCase()}
            </span>
            {simulation.status === 'running' && (
              <span className="text-sm text-gray-400">
                {elapsed}s / {duration}s ({remaining}s remaining)
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-pink to-cyber-purple"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Progress: {Math.min(progress, 100).toFixed(1)}%</span>
          <span>{duration}s total duration</span>
        </div>
      </div>

      {/* Attack Flow Visualization */}
      <div className="relative py-12">
        <div className="flex items-center justify-between">
          {/* Attacker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-cyber-pink/20 border-2 border-cyber-pink rounded-full flex items-center justify-center mb-3 glow-purple">
              <AlertCircle className="w-10 h-10 text-cyber-pink" />
            </div>
            <p className="text-sm font-medium text-white">Attacker</p>
            <p className="text-xs text-gray-400">{config.spoofedIP || 'Unknown'}</p>
          </motion.div>

          {/* Attack Arrow */}
          <div className="flex-1 relative">
            <motion.div
              className="h-1 bg-gradient-to-r from-cyber-pink to-cyber-purple"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: simulation.status === 'running' ? 1 : 0 }}
              transition={{ duration: 1, repeat: simulation.status === 'running' ? Infinity : 0 }}
              style={{ originX: 0 }}
            />
            {simulation.status === 'running' && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyber-pink rounded-full"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          {/* DNS Server */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-cyber-blue/20 border-2 border-cyber-blue rounded-full flex items-center justify-center mb-3 glow-blue">
              <Wifi className="w-10 h-10 text-cyber-blue" />
            </div>
            <p className="text-sm font-medium text-white">DNS Server</p>
            <p className="text-xs text-gray-400">Vulnerable</p>
          </motion.div>

          {/* Response Arrow */}
          <div className="flex-1 relative">
            <motion.div
              className="h-1 bg-gradient-to-r from-cyber-purple to-cyber-green"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: simulation.status === 'running' ? 1 : 0 }}
              transition={{
                duration: 1,
                repeat: simulation.status === 'running' ? Infinity : 0,
                delay: 0.5,
              }}
              style={{ originX: 0 }}
            />
          </div>

          {/* Target */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-cyber-green/20 border-2 border-cyber-green rounded-full flex items-center justify-center mb-3 glow-green">
              <Server className="w-10 h-10 text-cyber-green" />
            </div>
            <p className="text-sm font-medium text-white">Target</p>
            <p className="text-xs text-gray-400">{config.targetDomain || 'Unknown'}</p>
          </motion.div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-2xl font-bold text-cyber-blue">
            {simulation.metrics?.totalQueries ?? simulation.totalQueries ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total Queries</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyber-pink">
            {simulation.metrics?.spoofedQueries ?? simulation.spoofedQueries ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Spoofed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyber-purple">
            {simulation.metrics?.blockedQueries ?? simulation.blockedQueries ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Blocked</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-cyber-green">
            {(simulation.metrics?.successRate ?? simulation.successRate ?? 0).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Success Rate</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationVisualizer;