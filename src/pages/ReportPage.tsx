import { useState, useCallback } from 'react';
import { FileText, Download, RefreshCw, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { reportApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, SectionHeader, StatCard, EmptyState, Spinner, ActionBadge, Badge } from '../components/ui';
import type { Report } from '../types';

export default function ReportPage() {
  const { session } = useSession();
  const { t } = useLang();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!session) return toast.error(t.sessions.noActive);
    setLoading(true);
    try {
      const r = await reportApi.get(session.id);
      setReport(r);
    } catch {
      toast.error(t.general.error);
    } finally {
      setLoading(false);
    }
  }, [session, t]);

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-lab-report-${session?.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const summaryChartData = report ? [
    { name: t.report.totalQueries, value: report.summary.totalQueries, color: '#60a5fa' },
    { name: t.report.spoofDetected, value: report.summary.spoofDetected, color: '#fbbf24' },
    { name: t.report.spoofBlocked, value: report.summary.spoofBlocked, color: '#f87171' },
    { name: t.report.safeForced, value: report.summary.safeResolutionForced, color: '#4ade80' },
  ] : [];

  // Action distribution for domains
  const actionData = report ? (() => {
    const counts: Record<string, number> = { PASS: 0, BLOCK: 0, FORCE_SAFE_IP: 0 };
    for (const domain of report.domains) {
      for (const s of domain.samples as Array<{ finalAction: string }>) {
        if (s.finalAction) counts[s.finalAction] = (counts[s.finalAction] || 0) + 1;
      }
    }
    return Object.entries(counts).map(([k, v]) => ({ name: k, value: v }));
  })() : [];

  return (
    <div className="space-y-8">
      <SectionHeader title={t.report.title} subtitle={t.report.subtitle} />

      <div className="flex gap-3">
        <Button variant="primary" onClick={fetchReport} loading={loading}>
          <FileText size={13} />
          {t.report.generate}
        </Button>
        {report && (
          <Button variant="outline" onClick={downloadJson}>
            <Download size={13} />
            {t.report.downloadJson}
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label={t.report.totalQueries} value={report.summary.totalQueries} color="text-blue-400" />
            <StatCard label={t.report.spoofDetected} value={report.summary.spoofDetected} color="text-warn-400" />
            <StatCard label={t.report.spoofBlocked} value={report.summary.spoofBlocked} color="text-danger-400" />
            <StatCard label={t.report.safeForced} value={report.summary.safeResolutionForced} color="text-success-400" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-4">{t.report.summary}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summaryChartData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontFamily: 'JetBrains Mono' }}
                    labelStyle={{ color: '#9ca3af', fontSize: 11 }}
                    itemStyle={{ color: '#14b8a6', fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {summaryChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-4">Action Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={actionData} barSize={50}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', fontFamily: 'JetBrains Mono' }}
                    labelStyle={{ color: '#9ca3af', fontSize: 11 }}
                    itemStyle={{ color: '#14b8a6', fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {actionData.map((entry, i) => (
                      <Cell key={i} fill={entry.name === 'PASS' ? '#4ade80' : entry.name === 'BLOCK' ? '#f87171' : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Domain analysis */}
          {report.domains.length > 0 && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-4">{t.report.domains}</h3>
              <div className="space-y-4">
                {report.domains.map(d => (
                  <div key={d.name} className="border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart2 size={14} className="text-cyber-400" />
                      <span className="font-mono text-sm text-cyber-400">{d.name}</span>
                      <Badge variant="ghost">{(d.samples as unknown[]).length} {t.report.samples}</Badge>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {(d.samples as Array<{
                        ts: string; qtype: string; resolver: string;
                        answer: string | null; finalAction: string | null; finalAnswer: string | null;
                      }>).map((s, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2 text-xs font-mono bg-gray-800/30 rounded px-3 py-1.5">
                          <span className="text-gray-500">{new Date(s.ts).toLocaleTimeString()}</span>
                          <Badge variant="ghost">{s.qtype}</Badge>
                          <Badge variant={s.resolver === 'LEGIT' ? 'success' : 'alert'}>{s.resolver}</Badge>
                          <span className="text-gray-400">{s.answer ?? '-'}</span>
                          <ActionBadge action={s.finalAction} />
                          {s.finalAnswer && <span className="text-cyber-400">→ {s.finalAnswer}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {!report && !loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center">
            <FileText size={36} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-body">{session ? 'Click "Generate Report" to analyze the session' : t.sessions.noActive}</p>
        </div>
      )}
    </div>
  );
}
