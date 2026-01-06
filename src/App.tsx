import { useState, useEffect } from 'react';
import { Shield, Activity, TestTube, BarChart3, Info, Presentation, Zap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard/Dashboard';
import SimulationLab from './components/SimulationLab/SimulationLab';
import MitigationCenter from './components/MitigationCenter/MitigationCenter';
import Analytics from './components/Analytics/Analytics';
import About from './components/About/About';
import DemoScenarios from './components/DemoScenarios';
import HybridDashboard from './components/HybridDashboard';

type Tab = 'dashboard' | 'demo' | 'simulation' | 'mitigation' | 'analytics' | 'about' | 'hybrid';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as Tab) || 'demo';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'demo' as Tab, label: '🎯 Demo Scenarios', icon: Presentation },
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Activity },
    { id: 'hybrid' as Tab, label: 'Hybrid Monitor', icon: Zap },
    { id: 'simulation' as Tab, label: 'Simulation Lab', icon: TestTube },
    { id: 'mitigation' as Tab, label: 'Mitigation Center', icon: Shield },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'about' as Tab, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-cyber-darker">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1f3a',
            color: '#fff',
            border: '1px solid #00d9ff',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#1a1f3a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff2e97',
              secondary: '#1a1f3a',
            },
          },
        }}
      />

      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">DNS Security Platform</h1>
                <p className="text-xs text-gray-400">Attack Simulation & Mitigation with Hybrid Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-cyber-green/20 text-cyber-green text-xs rounded-full">
                System Active
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="glass border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-4 transition-all duration-300 whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-cyber-blue/20 text-cyber-blue border-b-2 border-cyber-blue' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'demo' && <DemoScenarios />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'hybrid' && <HybridDashboard />}
        {activeTab === 'simulation' && <SimulationLab />}
        {activeTab === 'mitigation' && <MitigationCenter />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'about' && <About />}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/10 mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>© 2025 DNS Security Platform - Diploma Project (Hybrid Mode Edition)</p>
            <p>Built with React + NestJS + PostgreSQL + Real DNS Monitoring</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;