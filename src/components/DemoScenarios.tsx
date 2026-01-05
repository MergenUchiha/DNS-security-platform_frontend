import { useState } from 'react';
import { Play, Target, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { simulationAPI } from '../services/api';

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  attackType: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  duration: number;
  targetDomain: string;
  spoofedIP: string;
  intensity: 'low' | 'medium' | 'high';
  expectedOutcome: string;
  realWorldExample: string;
  icon: any;
  color: string;
}

const DemoScenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const scenarios: DemoScenario[] = [
    {
      id: 'banking-fraud',
      name: '🏦 Banking Phishing Attack',
      description: 'Attacker redirects users from legitimate bank website to fake phishing site',
      attackType: 'dns_cache_poisoning',
      difficulty: 'hard',
      duration: 120,
      targetDomain: 'secure-bank.com',
      spoofedIP: '203.0.113.50',
      intensity: 'high',
      expectedOutcome: 'DNSSEC should block 80%+ of spoofed queries',
      realWorldExample: 'Similar to 2019 Sea Turtle DNS hijacking campaign targeting banks',
      icon: Target,
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'corporate-espionage',
      name: '🏢 Corporate Network Infiltration',
      description: 'MITM attack on corporate DNS to intercept sensitive communications',
      attackType: 'man_in_the_middle',
      difficulty: 'extreme',
      duration: 180,
      targetDomain: 'internal.company.com',
      spoofedIP: '192.168.100.50',
      intensity: 'high',
      expectedOutcome: 'Firewall rules and DNSSEC should prevent intrusion',
      realWorldExample: 'APT groups often use DNS hijacking for corporate espionage',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'social-media-hijack',
      name: '📱 Social Media Account Takeover',
      description: 'Redirect users to fake login page to steal credentials',
      attackType: 'local_dns_hijack',
      difficulty: 'medium',
      duration: 90,
      targetDomain: 'social-network.com',
      spoofedIP: '198.51.100.20',
      intensity: 'medium',
      expectedOutcome: 'Rate limiting should detect unusual patterns',
      realWorldExample: 'Common in public WiFi attacks at cafes and airports',
      icon: Shield,
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 'ransomware-delivery',
      name: '💀 Ransomware Distribution Network',
      description: 'Rogue DNS server distributes malware by redirecting software updates',
      attackType: 'rogue_dns_server',
      difficulty: 'hard',
      duration: 150,
      targetDomain: 'software-updates.com',
      spoofedIP: '203.0.113.100',
      intensity: 'high',
      expectedOutcome: 'Trusted resolver whitelist should block rogue server',
      realWorldExample: 'DNSChanger botnet infected 4 million computers using this technique',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'ecommerce-fraud',
      name: '🛒 E-commerce Payment Interception',
      description: 'Redirect checkout pages to steal payment information',
      attackType: 'dns_cache_poisoning',
      difficulty: 'medium',
      duration: 60,
      targetDomain: 'online-store.com',
      spoofedIP: '192.0.2.100',
      intensity: 'medium',
      expectedOutcome: 'DNSSEC validation should protect users',
      realWorldExample: 'Black Friday attacks often target e-commerce DNS',
      icon: TrendingUp,
      color: 'from-green-500 to-blue-500',
    },
    {
      id: 'government-attack',
      name: '🏛️ Government Website Defacement',
      description: 'Nation-state actors redirect government site to propaganda',
      attackType: 'man_in_the_middle',
      difficulty: 'extreme',
      duration: 240,
      targetDomain: 'government.gov',
      spoofedIP: '203.0.113.200',
      intensity: 'high',
      expectedOutcome: 'Multi-layer defense should prevent any successful redirects',
      realWorldExample: 'Similar to Iran DNS hijacking incidents affecting government sites',
      icon: CheckCircle,
      color: 'from-red-600 to-orange-600',
    },
  ];

  const difficultyConfig = {
    easy: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Easy' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Medium' },
    hard: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Hard' },
    extreme: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Extreme' },
  };

  const handleRunScenario = async (scenario: DemoScenario) => {
    try {
      setIsRunning(true);
      toast.loading(`Launching ${scenario.name}...`, { id: 'scenario' });

      const config = {
        type: scenario.attackType as any,
        targetDomain: scenario.targetDomain,
        spoofedIP: scenario.spoofedIP,
        intensity: scenario.intensity,
        duration: scenario.duration,
      };

      await simulationAPI.start(config);
      toast.success(`Scenario started! Watch the real-time defense in action.`, { id: 'scenario' });
    } catch (error) {
      console.error('Failed to run scenario:', error);
      toast.error('Failed to start scenario', { id: 'scenario' });
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gradient mb-4">🎯 Real-World Attack Scenarios</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Experience how DNS Security Platform protects against real cyber threats
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Easy</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Hard</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Extreme</span>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => {
          const Icon = scenario.icon;
          const difficulty = difficultyConfig[scenario.difficulty];

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedScenario(scenario)}
              className="glass rounded-xl p-6 cursor-pointer hover:border-cyber-blue/50 border-2 border-transparent transition-all duration-300 hover:scale-105"
            >
              {/* Icon & Difficulty */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">{scenario.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{scenario.description}</p>

              {/* Stats */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white">{scenario.duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Intensity:</span>
                  <span className="text-white uppercase">{scenario.intensity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="text-white font-mono">{scenario.targetDomain}</span>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRunScenario(scenario);
                }}
                disabled={isRunning}
                className={`
                  w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
                  ${isRunning
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : `bg-gradient-to-r ${scenario.color} hover:shadow-lg`
                  } text-white
                `}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Scenario'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Scenario Details Modal */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScenario(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedScenario.color} flex items-center justify-center`}>
                    <selectedScenario.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedScenario.name}</h2>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${difficultyConfig[selectedScenario.difficulty].bg} ${difficultyConfig[selectedScenario.difficulty].color}`}>
                      {difficultyConfig[selectedScenario.difficulty].label} Difficulty
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">📋 Scenario Description</h3>
                  <p className="text-gray-300">{selectedScenario.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">🌍 Real-World Example</h3>
                  <p className="text-gray-300">{selectedScenario.realWorldExample}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">🎯 Expected Outcome</h3>
                  <p className="text-green-400">{selectedScenario.expectedOutcome}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Attack Type</p>
                    <p className="text-white font-medium">{selectedScenario.attackType.replace(/_/g, ' ').toUpperCase()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Duration</p>
                    <p className="text-white font-medium">{selectedScenario.duration} seconds</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Target Domain</p>
                    <p className="text-white font-mono text-sm">{selectedScenario.targetDomain}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Intensity</p>
                    <p className="text-white font-medium uppercase">{selectedScenario.intensity}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleRunScenario(selectedScenario);
                    setSelectedScenario(null);
                  }}
                  disabled={isRunning}
                  className={`
                    w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                    ${isRunning
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : `bg-gradient-to-r ${selectedScenario.color} hover:shadow-2xl hover:scale-105`
                    } text-white
                  `}
                >
                  <Play className="w-5 h-5" />
                  <span>{isRunning ? 'Scenario Running...' : 'Launch This Scenario'}</span>
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoScenarios;