import { useState } from 'react';
import { Play, Zap, ExternalLink, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { demoApi, labApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, Input, SectionHeader, ModeBadge, ActionBadge, AlertBanner, Spinner } from '../components/ui';
import type { DemoResult, TargetUrlResult } from '../types';

function StepCard({ label, result, icon }: { label: string; result: TargetUrlResult | null; icon: React.ReactNode }) {
  if (!result) return null;
  return (
    <Card className="p-5" glow={!!result.alert}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="font-display font-semibold text-white">{label}</span>
        <ModeBadge mode={result.mode} />
        <ActionBadge action={result.finalAction} />
      </div>

      {result.alert && (
        <AlertBanner
          message={result.alert.reason}
          variant={result.finalAction === 'BLOCK' ? 'danger' : 'warn'}
        />
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
        {[
          ['Resolver', result.resolver],
          ['Raw Answer', result.answer ?? '-'],
          ['Final Answer', result.finalAnswer ?? (result.finalAction === 'BLOCK' ? 'BLOCKED' : '-')],
          ['RTT', result.rttMs !== null ? `${result.rttMs}ms` : '-'],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">{k}</p>
            <p className={`text-gray-200 ${k === 'Final Answer' && result.finalAction === 'BLOCK' ? 'text-danger-400' : k === 'Final Answer' && result.finalAction === 'FORCE_SAFE_IP' ? 'text-warn-400' : ''}`}>{v as string}</p>
          </div>
        ))}
      </div>

      {result.targetUrl && (
        <div className="mt-3 border-t border-gray-700/50 pt-3">
          <a
            href={result.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-cyber-400 hover:text-cyber-300 transition-colors"
          >
            <ExternalLink size={12} />
            {result.targetUrl}
          </a>
        </div>
      )}
    </Card>
  );
}

export default function DemoPage() {
  const { session, setSession } = useSession();
  const { t } = useLang();
  const [domain, setDomain] = useState('bank.lab');
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  const handleFullDemo = async () => {
    setLoading(true);
    try {
      const res = await demoApi.run(domain || undefined);
      setResult(res);
      // Update active session with the one demo created
      if (res.sessionId) {
        const updated = await import('../api').then(m => m.sessionsApi.current());
        setSession(updated);
      }
      toast.success(t.general.success);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? t.general.error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    if (!session) return toast.error(t.sessions.noActive);
    setQuickLoading(true);
    try {
      const res = await labApi.quickDemo(session.id, domain || undefined);
      setResult(res);
      setSession({ ...session, mode: 'MITIGATED' });
      toast.success(t.general.success);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setSession(null);
        toast.error('Сессия не найдена. Создайте новую сессию.');
      } else {
        toast.error(e?.response?.data?.message ?? t.general.error);
      }
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title={t.demo.title} subtitle={t.demo.subtitle} />

      {/* Controls */}
      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-48">
            <Input
              label={t.demo.domainLabel}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="bank.lab"
            />
          </div>
          <Button variant="primary" onClick={handleFullDemo} loading={loading} size="lg">
            <Play size={15} />
            {t.demo.runDemo}
          </Button>
          <Button variant="outline" onClick={handleQuickDemo} loading={quickLoading} size="lg">
            <Zap size={15} />
            {t.demo.quickDemo}
          </Button>
        </div>
        <p className="text-xs font-mono text-gray-600 mt-3">
          ⓘ {t.demo.newSession}
        </p>
      </Card>

      {(loading || quickLoading) && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <Spinner size="lg" />
          <div className="text-center space-y-1">
            <p className="font-mono text-cyber-400 text-sm">Running simulation...</p>
            <p className="font-mono text-gray-500 text-xs">Safe → Attack → Mitigated</p>
          </div>
        </div>
      )}

      {result && !loading && !quickLoading && (
        <div className="space-y-6">
          {/* Session info */}
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-gray-500">Session:</span>
            <span className="text-cyber-400">{result.sessionId}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">Domain:</span>
            <span className="text-cyber-400">{result.domain}</span>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard
              label={t.demo.steps.safe}
              result={result.steps.safe}
              icon={<CheckCircle size={16} className="text-success-400" />}
            />
            <StepCard
              label={t.demo.steps.attack}
              result={result.steps.attack}
              icon={<AlertTriangle size={16} className="text-danger-400" />}
            />
            <StepCard
              label={t.demo.steps.mitigated}
              result={result.steps.mitigated}
              icon={<Shield size={16} className="text-cyber-400" />}
            />
          </div>

          {/* Useful links */}
          {result.hint && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-3">{t.demo.hint}</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(result.hint).map(([k, v]) => (
                  <a
                    key={k}
                    href={v as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-cyber-400 hover:text-cyber-300 transition-colors"
                  >
                    <ExternalLink size={11} />
                    <span className="capitalize">{k}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
