import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

const EpicSimulationVisualizer = ({ simulation }: Props) => {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; type: string }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Progress tracking
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

  // Particle animation system
  useEffect(() => {
    if (!simulation || simulation.status !== 'running') {
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Generate particles based on query activity
    const particleInterval = setInterval(() => {
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: Math.random() > 0.6 ? 'attack' : Math.random() > 0.3 ? 'defense' : 'normal',
      }));

      setParticles(prev => [...prev.slice(-20), ...newParticles]);
    }, 500);

    return () => clearInterval(particleInterval);
  }, [simulation]);

  // Canvas animation for background effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string }> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: ['#00d9ff', '#b537f2', '#ff2e97'][Math.floor(Math.random() * 3)],
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(0, 217, 255, ${(100 - distance) / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [simulation]);

  if (!simulation) {
    return (
      <div className="glass rounded-xl p-12 text-center relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative z-10"
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
      {/* Epic Header with Status */}
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
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
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
      <div className="glass rounded-xl overflow-hidden relative" style={{ height: '500px' }}>
        {/* Animated Background */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Attack Flow Visualization */}
        <div className="relative z-10 h-full flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-4 gap-8 items-center">
              {/* Attacker Node */}
              <motion.div
                initial={{ scale: 0, x: -100 }}
                animate={{ scale: 1, x: 0 }}
                className="relative"
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
                  
                  {/* Pulse rings */}
                  {simulation.status === 'running' && (
                    <>
                      <motion.div
                        className="absolute inset-0 border-4 border-cyber-pink rounded-full"
                        animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 border-4 border-cyber-pink rounded-full"
                        animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </>
                  )}
                </motion.div>
                
                <div className="text-center mt-4">
                  <p className="text-white font-bold">ATTACKER</p>
                  <p className="text-xs text-cyber-pink font-mono">{config.spoofedIP}</p>
                </div>

                {/* Attack particles */}
                {simulation.status === 'running' && (
                  <AnimatePresence>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={`attack-${i}-${Date.now()}`}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: 200,
                          y: [0, -20, 0, 20, 0],
                          opacity: 0,
                          scale: [1, 1.5, 1],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyber-pink rounded-full"
                        style={{ boxShadow: '0 0 10px rgba(255,46,151,0.8)' }}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* DNS Server Node */}
              <motion.div
                initial={{ scale: 0, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
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
                  <p className="text-white font-bold">DNS SERVER</p>
                  <p className="text-xs text-cyber-blue">Processing</p>
                </div>
              </motion.div>

              {/* Defense Shield Node */}
              <motion.div
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
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
                  
                  {/* Defense particles */}
                  {simulation.status === 'running' && metrics.blockedQueries > 0 && (
                    <>
                      <motion.div
                        className="absolute inset-0 border-4 border-cyber-green rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </>
                  )}
                </motion.div>
                
                <div className="text-center mt-4">
                  <p className="text-white font-bold">DEFENSE SYSTEM</p>
                  <p className="text-xs text-cyber-purple">DNSSEC + Firewall</p>
                </div>
              </motion.div>

              {/* Target Node */}
              <motion.div
                initial={{ scale: 0, x: 100 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
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
                  <p className="text-white font-bold">TARGET</p>
                  <p className="text-xs text-cyber-green font-mono">{config.targetDomain}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Bar Overlay */}
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
              className={`glass rounded-xl p-6 relative overflow-hidden`}
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
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} />
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