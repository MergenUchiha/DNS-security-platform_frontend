import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { healthApi } from '../api';
import { useLang } from '../contexts/LangContext';
import { Card, Button, SectionHeader, Badge } from '../components/ui';

export default function HealthPage() {
  const { t } = useLang();
  const [status, setStatus] = useState<{ ok: boolean; ts: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const check = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await healthApi.check();
      setStatus(res);
      setCheckedAt(new Date().toLocaleString());
    } catch {
      setStatus(null);
      setError(true);
      setCheckedAt(new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { check(); }, []);

  const isOk = status?.ok && !error;

  return (
    <div className="space-y-8">
      <SectionHeader title={t.health.title} subtitle={t.health.subtitle} />

      <div className="max-w-md">
        <Card className={`p-8 flex flex-col items-center gap-6 ${isOk ? 'border-success-500/30' : 'border-danger-500/30'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isOk ? 'bg-success-500/10' : 'bg-danger-500/10'
          }`}>
            {loading ? (
              <div className="w-10 h-10 border-3 border-cyber-500 border-t-transparent rounded-full animate-spin" />
            ) : isOk ? (
              <CheckCircle2 size={48} className="text-success-500" />
            ) : (
              <XCircle size={48} className="text-danger-500" />
            )}
          </div>

          <div className="text-center">
            <p className={`text-xl font-display font-bold ${isOk ? 'text-success-400' : 'text-danger-400'}`}>
              {loading ? t.general.loading : isOk ? t.health.ok : t.health.fail}
            </p>
            {checkedAt && (
              <p className="text-xs font-mono text-gray-500 mt-1">
                {t.health.lastChecked}: {checkedAt}
              </p>
            )}
          </div>

          {status && (
            <div className="w-full border border-gray-700/50 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={isOk ? 'success' : 'alert'}>{status.ok ? 'OK' : 'FAIL'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Server time:</span>
                <span className="text-gray-300">{new Date(status.ts).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">API base:</span>
                <span className="text-cyber-400">/api</span>
              </div>
            </div>
          )}

          <Button variant="outline" onClick={check} loading={loading} className="w-full">
            <RefreshCw size={13} />
            {t.health.check}
          </Button>
        </Card>

        {/* API Endpoints info */}
        <Card className="p-5 mt-4">
          <h3 className="font-display font-semibold text-white text-sm mb-3">API Endpoints</h3>
          <div className="space-y-1.5">
            {[
              ['GET', '/health', 'System health'],
              ['POST', '/sessions', 'Create session'],
              ['GET', '/sessions/current', 'Get active session'],
              ['POST', '/lab/:id/mode', 'Set lab mode'],
              ['GET', '/dns/resolve', 'DNS resolution'],
              ['GET', '/dns/target-url', 'Resolve + URL'],
              ['GET', '/mitigation/:id/policies', 'List policies'],
              ['PUT', '/mitigation/:id/policies', 'Upsert policy'],
              ['GET', '/events', 'Event log'],
              ['GET', '/report/:id', 'Generate report'],
              ['POST', '/demo/run', 'Full demo'],
            ].map(([method, path, desc]) => (
              <div key={path} className="flex items-center gap-2 text-xs font-mono">
                <span className={`w-10 text-center py-0.5 rounded text-[10px] font-bold ${
                  method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  method === 'POST' ? 'bg-success-500/20 text-success-400' :
                  'bg-warn-500/20 text-warn-400'
                }`}>{method}</span>
                <span className="text-gray-400 flex-1">{path}</span>
                <span className="text-gray-600 text-[10px] hidden sm:block">{desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
