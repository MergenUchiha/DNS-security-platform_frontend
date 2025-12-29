import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AttackCharts = () => {
  // Sample data for attacks over time
  const timelineData = [
    { date: 'Mon', total: 45, blocked: 38, successful: 7 },
    { date: 'Tue', total: 62, blocked: 54, successful: 8 },
    { date: 'Wed', total: 58, blocked: 51, successful: 7 },
    { date: 'Thu', total: 71, blocked: 65, successful: 6 },
    { date: 'Fri', total: 53, blocked: 48, successful: 5 },
    { date: 'Sat', total: 39, blocked: 36, successful: 3 },
    { date: 'Sun', total: 42, blocked: 39, successful: 3 },
  ];

  // Attack types distribution
  const attackTypesData = [
    { name: 'Cache Poisoning', value: 45, color: '#00d9ff' },
    { name: 'MITM', value: 30, color: '#b537f2' },
    { name: 'DNS Hijack', value: 15, color: '#ff2e97' },
    { name: 'Rogue Server', value: 10, color: '#00ff88' },
  ];

  return (
    <div className="space-y-6">
      {/* Attack Timeline */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Attack Timeline - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0e27',
                border: '1px solid #ffffff20',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#00d9ff"
              strokeWidth={2}
              name="Total Attacks"
              dot={{ fill: '#00d9ff', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="blocked"
              stroke="#00ff88"
              strokeWidth={2}
              name="Blocked"
              dot={{ fill: '#00ff88', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="successful"
              stroke="#ff2e97"
              strokeWidth={2}
              name="Successful"
              dot={{ fill: '#ff2e97', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Types Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Attack Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attackTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {attackTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0e27',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Success vs Blocked */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Success vs Blocked Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0e27',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="blocked" fill="#00ff88" name="Blocked" />
              <Bar dataKey="successful" fill="#ff2e97" name="Successful" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttackCharts;