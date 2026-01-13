import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useI18n } from '../../i18n';
import type { AttackStatistics } from '../../types';

interface Props {
  statistics: AttackStatistics[];
}

const AttackCharts = ({ statistics }: Props) => {
  const { t } = useI18n();

  // Transform data for timeline chart
  const timelineData = statistics.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: stat.total,
    blocked: stat.blocked,
    successful: stat.successful,
  }));

  // Calculate total attack types
  const totalAttackTypes = statistics.reduce(
    (acc, stat) => {
      Object.keys(stat.attackTypes).forEach((key) => {
        const attackKey = key as keyof typeof stat.attackTypes;
        acc[attackKey] = (acc[attackKey] || 0) + stat.attackTypes[attackKey];
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const attackTypesData = [
    {
      name: t.analytics.cachePoisoning,
      value: totalAttackTypes.dns_cache_poisoning || 0,
      color: '#00d9ff',
    },
    {
      name: t.analytics.mitm,
      value: totalAttackTypes.man_in_the_middle || 0,
      color: '#b537f2',
    },
    {
      name: t.analytics.dnsHijack,
      value: totalAttackTypes.local_dns_hijack || 0,
      color: '#ff2e97',
    },
    {
      name: t.analytics.rogueServer,
      value: totalAttackTypes.rogue_dns_server || 0,
      color: '#00ff88',
    },
  ].filter((item) => item.value > 0);

  if (statistics.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-gray-400">{t.analytics.noAnalyticsData}</p>
        <p className="text-sm text-gray-500 mt-2">{t.analytics.runSimulations}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Attack Timeline */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          {t.analytics.attackTimeline} - {statistics.length} {t.analytics.days}
        </h3>
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
              name={t.analytics.totalAttacks}
              dot={{ fill: '#00d9ff', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="blocked"
              stroke="#00ff88"
              strokeWidth={2}
              name={t.simulation.blocked}
              dot={{ fill: '#00ff88', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="successful"
              stroke="#ff2e97"
              strokeWidth={2}
              name={t.analytics.successfulAttacks}
              dot={{ fill: '#ff2e97', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Types Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">{t.analytics.attackTypesDistribution}</h3>
          {attackTypesData.length > 0 ? (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No attack type data
            </div>
          )}
        </div>

        {/* Success vs Blocked */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">{t.analytics.successVsBlocked}</h3>
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
              <Bar dataKey="blocked" fill="#00ff88" name={t.simulation.blocked} />
              <Bar dataKey="successful" fill="#ff2e97" name={t.analytics.successfulAttacks} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttackCharts;