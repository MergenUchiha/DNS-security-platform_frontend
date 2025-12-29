import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AttackConfigurator from './AttackConfigurator';
import SimulationVisualizer from './SimulationVisualizer';
import type { AttackConfig, SimulationResult } from '../../types';
import { simulationAPI } from '../../services/api';
import websocketService from '../../services/websocket';

const SimulationLab = () => {
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Listen for simulation updates
    const handleSimulationUpdate = (data: SimulationResult) => {
      console.log('📡 Simulation update received:', data);
      
      // Ensure metrics exist with fallback
      const updatedData = {
        ...data,
        metrics: data.metrics || {
          totalQueries: data.totalQueries || 0,
          spoofedQueries: data.spoofedQueries || 0,
          blockedQueries: data.blockedQueries || 0,
          successRate: data.successRate || 0,
        },
      };
      
      setSimulation(updatedData);
      setIsRunning(data.status === 'running');
      
      // Clear simulation after completion
      if (data.status === 'completed' || data.status === 'stopped') {
        console.log('✅ Simulation finished, will clear in 5 seconds');
        setTimeout(() => {
          console.log('🧹 Clearing simulation state');
          setSimulation(null);
          setIsRunning(false);
        }, 5000); // Show final state for 5 seconds
      }
    };

    websocketService.onSimulationUpdate(handleSimulationUpdate);

    // Cleanup on unmount
    return () => {
      websocketService.offSimulationUpdate(handleSimulationUpdate);
    };
  }, []);

  const handleStart = async (config: AttackConfig) => {
    try {
      setError(null);
      setIsRunning(true);
      
      console.log('🚀 Starting simulation with config:', config);
      toast.loading('Starting attack simulation...', { id: 'simulation' });
      
      const result = await simulationAPI.start(config);
      
      console.log('✅ Simulation started:', result);
      toast.success('Attack simulation started successfully!', { id: 'simulation' });
      
      // Ensure metrics exist
      const simulationWithMetrics = {
        ...result,
        metrics: result.metrics || {
          totalQueries: result.totalQueries || 0,
          spoofedQueries: result.spoofedQueries || 0,
          blockedQueries: result.blockedQueries || 0,
          successRate: result.successRate || 0,
        },
      };
      
      setSimulation(simulationWithMetrics);

      // Auto-stop after duration
      setTimeout(async () => {
        if (result.id) {
          await handleStop(result.id);
        }
      }, config.duration * 1000);
    } catch (err: any) {
      console.error('❌ Failed to start simulation:', err);
      const errorMsg = err.response?.data?.message || 'Failed to start simulation. Please check backend connection.';
      setError(errorMsg);
      toast.error(errorMsg, { id: 'simulation' });
      setIsRunning(false);
    }
  };

  const handleStop = async (id?: string) => {
    try {
      const simulationId = id || simulation?.id;
      if (!simulationId) return;

      console.log('🛑 Stopping simulation:', simulationId);
      toast.loading('Stopping simulation...', { id: 'stop' });
      
      const result = await simulationAPI.stop(simulationId);
      
      console.log('✅ Simulation stopped:', result);
      toast.success('Simulation completed!', { id: 'stop' });
      
      setSimulation(result);
      setIsRunning(false);
    } catch (err: any) {
      console.error('❌ Failed to stop simulation:', err);
      const errorMsg = err.response?.data?.message || 'Failed to stop simulation';
      setError(errorMsg);
      toast.error(errorMsg, { id: 'stop' });
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-2">Simulation Laboratory</h2>
        <p className="text-gray-400">Configure and execute controlled DNS spoofing attacks</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass border-2 border-red-500/50 bg-red-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <AttackConfigurator 
        onStart={handleStart} 
        onStop={() => handleStop()} 
        isRunning={isRunning} 
      />

      {/* Visualization */}
      <SimulationVisualizer simulation={simulation} />
    </div>
  );
};

export default SimulationLab;