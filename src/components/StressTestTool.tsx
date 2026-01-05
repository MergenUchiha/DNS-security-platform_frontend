import { useState } from 'react';
import { Zap, Play, Square, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { simulationAPI } from '../services/api';

/**
 * Advanced Stress Testing Tool
 * For demonstrating system capacity and performance
 */
const StressTestTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const stressTests = [
    {
      name: 'Quick Burst',
      description: 'Rapid succession of 5 attacks',
      attacks: 5,
      interval: 2000,
      duration: 30,
    },
    {
      name: 'Sustained Attack',
      description: 'Continuous pressure over 3 minutes',
      attacks: 10,
      interval: 15000,
      duration: 60,
    },
    {
      name: 'Multi-Vector',
      description: 'All attack types simultaneously',
      attacks: 4,
      interval: 0,
      duration: 120,
    },
  ];

  const attackTypes = [
    'dns_cache_poisoning',
    'man_in_the_middle',
    'local_dns_hijack',
    'rogue_dns_server',
  ];

  const runStressTest = async (test: typeof stressTests[0]) => {
    setIsRunning(true);
    setResults([]);
    toast.loading(`Starting ${test.name}...`, { id: 'stress' });

    const testResults: any[] = [];

    try {
      for (let i = 0; i < test.attacks; i++) {
        const attackType = attackTypes[i % attackTypes.length];
        const config = {
          type: attackType as any,
          targetDomain: `target-${i + 1}.com`,
          spoofedIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          intensity: 'high' as const,
          duration: test.duration,
        };

        const startTime = Date.now();
        try {
          const result = await simulationAPI.start(config);
          const responseTime = Date.now() - startTime;

          testResults.push({
            id: i + 1,
            type: attackType,
            status: 'success',
            responseTime,
            result,
          });

          toast.success(`Attack ${i + 1}/${test.attacks} launched`, { id: `attack-${i}` });
        } catch (error) {
          testResults.push({
            id: i + 1,
            type: attackType,
            status: 'failed',
            error,
          });
        }

        if (test.interval > 0 && i < test.attacks - 1) {
          await new Promise((resolve) => setTimeout(resolve, test.interval));
        }
      }

      setResults(testResults);
      toast.success(`${test.name} completed!`, { id: 'stress' });
    } catch (error) {
      toast.error('Stress test failed', { id: 'stress' });
    } finally {
      setIsRunning(false);
    }
  };

  const avgResponseTime = results.length > 0
    ? results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length
    : 0;

  const successRate = results.length > 0
    ? (results.filter((r) => r.status === 'success').length / results.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Stress Test Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stressTests.map((test, idx) => (
          <motion.div
            key={test.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-pink to-cyber-purple rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-400">{test.attacks} attacks</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{test.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{test.description}</p>

            <div className="space-y-2 text-xs text-gray-500 mb-4">
              <div className="flex justify-between">
                <span>Attacks:</span>
                <span className="text-white">{test.attacks}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-white">{test.duration}s each</span>
              </div>
              <div className="flex justify-between">
                <span>Interval:</span>
                <span className="text-white">
                  {test.interval === 0 ? 'Simultaneous' : `${test.interval / 1000}s`}
                </span>
              </div>
            </div>

            <button
              onClick={() => runStressTest(test)}
              disabled={isRunning}
              className={`
                w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
                ${isRunning
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-cyber-pink to-cyber-purple hover:shadow-lg'
                } text-white
              `}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Test</span>
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Test Results</h3>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-cyber-blue" />
                <span className="text-sm text-gray-400">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-cyber-green">{successRate.toFixed(1)}%</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-5 h-5 text-cyber-purple" />
                <span className="text-sm text-gray-400">Avg Response Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{avgResponseTime.toFixed(0)}ms</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Play className="w-5 h-5 text-cyber-pink" />
                <span className="text-sm text-gray-400">Total Attacks</span>
              </div>
              <p className="text-2xl font-bold text-white">{results.length}</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      result.status === 'success'
                        ? 'bg-cyber-green/20 text-cyber-green'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {result.id}
                  </span>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {result.type.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    {result.responseTime && (
                      <p className="text-xs text-gray-400">{result.responseTime}ms response</p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.status === 'success'
                      ? 'bg-cyber-green/20 text-cyber-green'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StressTestTool;