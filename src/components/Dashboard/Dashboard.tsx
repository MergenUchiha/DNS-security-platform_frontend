import MetricsPanel from './MetricsPanel';
import NetworkGraph from './NetworkGraph';
import LiveTrafficMonitor from './LiveTrafficMonitor';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-2">Security Dashboard</h2>
        <p className="text-gray-400">Real-time monitoring of DNS traffic and security events</p>
      </div>

      {/* Metrics Cards */}
      <MetricsPanel />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <NetworkGraph />
        </div>

        {/* Live Traffic Monitor */}
        <div className="lg:col-span-2">
          <LiveTrafficMonitor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;