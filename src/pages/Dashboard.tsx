import { useEffect, useState, useCallback } from 'react';
import { Activity, Shield, AlertTriangle, CheckCircle, RefreshCw, Cpu, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { labApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { SessionManager } from '../components/SessionManager';
import { Card, Button, StatCard, ModeBadge, ActionBadge, SectionHeader, EmptyState, CodeBlock, Spinner } from '../components/ui';
import type { LabStatus, LabMode } from '../types';

const MODES: LabMode[] = ['SAFE', 'ATTACK', 'MITIGATED'];

const MODE_ICONS: Record<LabMode, React.ReactNode> = {
  SAFE: <CheckCircle size={18} />,
  ATTACK: <AlertTriangle size={18} />,
  MITIGATED: <Shield size={18} />,
};

export default function Dashboard() {
  const { session, setSession } = useSession();
  const { t } = useLang();
  const [status, setStatus] = useState<LabStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [modeLoading, setModeLoading] = useState<LabMode | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const s = await labApi.status(session.id, undefined, 10);
      setStatus(s);
      // Sync mode from server in case it changed
      if (s.session.mode !== session.mode) {
        setSession({ ...session, mode: s.session.mode });
      }
    } catch (err: any) {
      // 404 means session no longer exists — clear it
      if (err?.response?.status === 404) {
        setSession(null);
      }
    } finally {
      setLoading(false);
    }
  }, [session, setSession]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSetMode = async (mode: LabMode) => {
    if (!session) return toast.error(t.sessions.noActive);
    setModeLoading(mode);
    try {
      const updated = await labApi.setMode(session.id, mode);
      setSession({ ...session, mode: updated.mode });
      await fetchStatus();
      toast.success(`Mode: ${mode}`);
    } catch {
      toast.error(t.general.error);
    } finally {
      setModeLoading(null);
    }
  };

  const handleReset = async () => {
    if (!session) return;
    try {
      await labApi.reset(session.id);
      setSession({ ...session, mode: 'SAFE' });
      await fetchStatus();
      toast.success(t.general.success);
    } catch {
      toast.error(t.general.error);
    }
  };

  const handleBootstrap = async () => {
    if (!session) return;
    try {
      await labApi.bootstrap(session.id);
      toast.success(t.dashboard.bootSuccess);
    } catch {
      toast.error(t.general.error);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Session + Mode */}
        <div className="lg:col-span-1 space-y-4">
          <SessionManager />

          {/* Mode switcher */}
          {session && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-4">{t.dashboard.setMode}</h3>
              <div className="space-y-2">
                {MODES.map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleSetMode(mode)}
                    disabled={modeLoading !== null}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-150 border
                      ${session.mode === mode
                        ? mode === 'SAFE' ? 'bg-success-500/15 border-success-500/40 text-success-400'
                          : mode === 'ATTACK' ? 'bg-danger-500/15 border-danger-500/40 text-danger-400'
                          : 'bg-cyber-500/15 border-cyber-500/40 text-cyber-400'
                        : 'bg-transparent border-gray-700/50 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                      }`}
                  >
                    {modeLoading === mode ? <Spinner size="sm" /> : MODE_ICONS[mode]}
                    {t.modes[mode]}
                    {session.mode === mode && <span className="ml-auto text-xs opacity-60">●</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={handleReset} className="flex-1">
                  {t.general.reset}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleBootstrap} className="flex-1">
                  Bootstrap
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Stats + Status */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label={t.dashboard.stats.queries}
              value={status?.stats.queriesCount ?? 0}
              icon={<Activity size={28} />}
              color="text-blue-400"
            />
            <StatCard
              label={t.dashboard.stats.detected}
              value={status?.stats.spoofDetected ?? 0}
              icon={<AlertTriangle size={28} />}
              color="text-warn-400"
            />
            <StatCard
              label={t.dashboard.stats.blocked}
              value={status?.stats.spoofBlocked ?? 0}
              icon={<Shield size={28} />}
              color="text-danger-400"
            />
            <StatCard
              label={t.dashboard.stats.forced}
              value={status?.stats.safeResolutionForced ?? 0}
              icon={<CheckCircle size={28} />}
              color="text-success-400"
            />
          </div>

          {/* Last query + Recent events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-white text-sm">{t.dashboard.lastQuery}</h3>
                {loading && <Spinner size="sm" />}
              </div>
              {status?.lastQuery ? (
                <div className="space-y-2 text-xs font-mono">
                  {[
                    ['Domain', status.lastQuery.name],
                    ['Resolver', status.lastQuery.resolver],
                    ['Answer', status.lastQuery.answer],
                    ['RTT', status.lastQuery.rttMs !== null ? `${status.lastQuery.rttMs}ms` : '-'],
                    ['TTL', status.lastQuery.ttl ?? '-'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-gray-500">{k}:</span>
                      <span className="text-gray-200 truncate max-w-[150px]">{v as string}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Final:</span>
                    <ActionBadge action={status.lastQuery.finalAction} />
                  </div>
                </div>
              ) : (
                <EmptyState icon={<Cpu />} message={t.dashboard.noQuery} />
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-white text-sm">{t.nav.events}</h3>
                <Button variant="ghost" size="sm" onClick={fetchStatus}>
                  <RefreshCw size={12} />
                </Button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {status?.events && status.events.length > 0 ? (
                  status.events.slice(0, 8).map(ev => (
                    <div key={ev.id} className="flex items-center gap-2 text-xs font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        ev.severity === 'ALERT' ? 'bg-danger-500' :
                        ev.severity === 'WARN' ? 'bg-warn-500' : 'bg-cyber-500'
                      }`} />
                      <span className="text-gray-400 flex-shrink-0 text-[10px]">
                        {new Date(ev.ts).toLocaleTimeString()}
                      </span>
                      <span className={`truncate ${
                        ev.severity === 'ALERT' ? 'text-danger-400' :
                        ev.severity === 'WARN' ? 'text-warn-400' : 'text-gray-300'
                      }`}>{ev.type}</span>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={<Zap />} message={t.events.noEvents} />
                )}
              </div>
            </Card>
          </div>

          {/* Policies */}
          {status?.policies && status.policies.length > 0 && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-3">{t.mitigation.policies}</h3>
              <div className="space-y-2">
                {status.policies.map(p => (
                  <div key={p.id} className="flex flex-wrap items-center gap-3 text-xs font-mono bg-gray-800/50 rounded-lg px-3 py-2">
                    <span className="text-cyber-400">{p.domain}</span>
                    <span className={`px-2 py-0.5 rounded ${p.action === 'BLOCK' ? 'bg-danger-500/20 text-danger-400' : 'bg-warn-500/20 text-warn-400'}`}>
                      {p.action}
                    </span>
                    <span className="text-gray-400">→ {p.allowedIps.join(', ')}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
