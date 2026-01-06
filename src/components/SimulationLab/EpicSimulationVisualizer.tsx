import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { SimulationResult } from '../../types';


interface Props {
  simulation: SimulationResult | null;
}

const EpicSimulationVisualizer = ({ simulation }: Props) => {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!simulation || simulation.status !== 'running') {
      setProgress(0);
      setElapsed(0);
      return;
    }

    const startTime = typeof simulation.startTime === 'string' 
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
      <div className="glass rounded-xl p-12 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple animate-pulse opacity-50" />
            <Shield className="w-12 h-12 text-white relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-3">Ready to Simulate</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Launch an attack simulation to see the cybersecurity defense system in action
          </p>
        </motion.div>
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
  const metrics = simulation.metrics || {
    totalQueries: simulation.totalQueries || 0,
    spoofedQueries: simulation.spoofedQueries || 0,
    blockedQueries: simulation.blockedQueries || 0,
    successRate: simulation.successRate || 0,
  };

  const statusConfig = {
    running: {
      color: 'from-cyber-pink to-red-600',
      glow: 'shadow-[0_0_40px_rgba(255,46,151,0.6)]',
      icon: Zap,
      text: 'ATTACK IN PROGRESS',
    },
    completed: {
      color: 'from-cyber-green to-green-600',
      glow: 'shadow-[0_0_40px_rgba(0,255,136,0.6)]',
      icon: CheckCircle,
      text: 'ATTACK NEUTRALIZED',
    },
    stopped: {
      color: 'from-gray-500 to-gray-600',
      glow: 'shadow-[0_0_40px_rgba(156,163,175,0.6)]',
      icon: XCircle,
      text: 'SIMULATION STOPPED',
    },
  };

  const status = statusConfig[simulation.status as keyof typeof statusConfig] || statusConfig.running;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Epic Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-xl p-6 border-2 bg-gradient-to-r ${status.color} bg-opacity-10 ${status.glow}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{
                rotate: simulation.status === 'running' ? 360 : 0,
                scale: simulation.status === 'running' ? [1, 1.1, 1] : 1,
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1, repeat: Infinity },
              }}
              className={`w-16 h-16 bg-gradient-to-br ${status.color} rounded-full flex items-center justify-center relative ${status.glow}`}
            >
              <StatusIcon className="w-8 h-8 text-white" />
              {simulation.status === 'running' && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{status.text}</h2>
              <p className="text-gray-400">
                Attack Type: <span className="text-cyber-blue font-mono">{config.type?.replace(/_/g, ' ').toUpperCase()}</span>
              </p>
            </div>
          </div>

          {simulation.status === 'running' && (
            <div className="text-right">
              <div className="text-4xl font-bold text-white mb-1">{remaining}s</div>
              <div className="text-sm text-gray-400">remaining</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Visualization Area */}
      <div className="glass rounded-xl overflow-hidden relative p-12" style={{ minHeight: '400px' }}>
        {/* 4 Nodes Network */}
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* 1. Attacker Node */}
          <motion.div
            initial={{ scale: 0, x: -50 }}
            animate={{ scale: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: simulation.status === 'running'
                  ? ['0 0 20px rgba(255,46,151,0.5)', '0 0 40px rgba(255,46,151,0.8)', '0 0 20px rgba(255,46,151,0.5)']
                  : '0 0 20px rgba(255,46,151,0.3)',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 bg-gradient-to-br from-cyber-pink to-red-600 rounded-full flex items-center justify-center relative"
            >
              <AlertTriangle className="w-16 h-16 text-white" />
              
              {simulation.status === 'running' && (
                <>
                  <motion.div
                    className="absolute inset-0 border-4 border-cyber-pink rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-cyber-pink rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </>
              )}
            </motion.div>
            
            <div className="text-center mt-4">
              <p className="text-white font-bold text-lg">ATTACKER</p>
              <p className="text-xs text-cyber-pink font-mono">{config.spoofedIP}</p>
            </div>
          </motion.div>

          {/* Connection Line 1: Attacker -> DNS */}
          <div className="flex-1 relative h-1 mx-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink/30 to-cyber-blue/30 rounded-full" />
            {simulation.status === 'running' && (
              <motion.div
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-cyber-pink to-transparent rounded-full"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          {/* 2. DNS Server Node */}
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: simulation.status === 'running'
                  ? ['0 0 20px rgba(0,217,255,0.5)', '0 0 40px rgba(0,217,255,0.8)', '0 0 20px rgba(0,217,255,0.5)']
                  : '0 0 20px rgba(0,217,255,0.3)',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 bg-gradient-to-br from-cyber-blue to-blue-600 rounded-full flex items-center justify-center relative"
            >
              <Activity className="w-16 h-16 text-white" />
            </motion.div>
            
            <div className="text-center mt-4">
              <p className="text-white font-bold text-lg">DNS SERVER</p>
              <p className="text-xs text-cyber-blue">Processing</p>
            </div>
          </motion.div>

          {/* Connection Line 2: DNS -> Defense */}
          <div className="flex-1 relative h-1 mx-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 rounded-full" />
            {simulation.status === 'running' && (
              <motion.div
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-cyber-blue to-transparent rounded-full"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              />
            )}
          </div>

          {/* 3. Defense Shield Node */}
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: simulation.status === 'running'
                  ? ['0 0 20px rgba(181,55,242,0.5)', '0 0 40px rgba(181,55,242,0.8)', '0 0 20px rgba(181,55,242,0.5)']
                  : '0 0 20px rgba(181,55,242,0.3)',
                rotate: simulation.status === 'running' ? 360 : 0,
              }}
              transition={{
                boxShadow: { duration: 1.5, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              }}
              className="w-32 h-32 bg-gradient-to-br from-cyber-purple to-purple-600 rounded-full flex items-center justify-center relative"
            >
              <Shield className="w-16 h-16 text-white" />
              
              {simulation.status === 'running' && metrics.blockedQueries > 0 && (
                <motion.div
                  className="absolute inset-0 border-4 border-cyber-green rounded-full"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div className="text-center mt-4">
              <p className="text-white font-bold text-lg">DEFENSE SYSTEM</p>
              <p className="text-xs text-cyber-purple">DNSSEC + Firewall</p>
            </div>
          </motion.div>

          {/* Connection Line 3: Defense -> Target */}
          <div className="flex-1 relative h-1 mx-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/30 to-cyber-green/30 rounded-full" />
            {simulation.status === 'running' && (
              <motion.div
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-cyber-purple to-transparent rounded-full"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 1 }}
              />
            )}
          </div>

          {/* 4. Target Node */}
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: simulation.status === 'completed'
                  ? '0 0 40px rgba(0,255,136,0.8)'
                  : '0 0 20px rgba(0,255,136,0.3)',
              }}
              className="w-32 h-32 bg-gradient-to-br from-cyber-green to-green-600 rounded-full flex items-center justify-center relative"
            >
              <CheckCircle className="w-16 h-16 text-white" />
              
              {simulation.status === 'completed' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 border-4 border-cyber-green rounded-full"
                />
              )}
            </motion.div>
            
            <div className="text-center mt-4">
              <p className="text-white font-bold text-lg">TARGET</p>
              <p className="text-xs text-cyber-green font-mono">{config.targetDomain}</p>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Queries', value: metrics.totalQueries, color: 'from-cyber-blue to-blue-600', icon: Activity },
          { label: 'Spoofed Attacks', value: metrics.spoofedQueries, color: 'from-cyber-pink to-red-600', icon: AlertTriangle },
          { label: 'Blocked', value: metrics.blockedQueries, color: 'from-cyber-purple to-purple-600', icon: Shield },
          { label: 'Success Rate', value: `${metrics.successRate.toFixed(1)}%`, color: 'from-cyber-green to-green-600', icon: CheckCircle },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-6 relative overflow-hidden"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-10`}
                animate={{
                  opacity: simulation.status === 'running' ? [0.1, 0.2, 0.1] : 0.1,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-white" style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} />
                  <motion.div
                    key={String(metric.value)}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-white"
                  >
                    {metric.value}
                  </motion.div>
                </div>
                <p className="text-sm text-gray-400">{metric.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EpicSimulationVisualizer;