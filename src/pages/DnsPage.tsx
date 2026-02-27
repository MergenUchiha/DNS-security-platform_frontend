import { useState } from 'react';
import { Search, ExternalLink, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { dnsApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, Input, Select, SectionHeader, ModeBadge, ActionBadge, AlertBanner, CodeBlock } from '../components/ui';
import type { ResolveResult, TargetUrlResult } from '../types';

type QueryType = 'A' | 'AAAA' | 'CNAME';

export default function DnsPage() {
  const { session } = useSession();
  const { t } = useLang();
  const [domain, setDomain] = useState('bank.lab');
  const [qtype, setQtype] = useState<QueryType>('A');
  const [result, setResult] = useState<ResolveResult | TargetUrlResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'resolve' | 'target'>('resolve');

  const handleResolve = async () => {
    if (!session) return toast.error(t.sessions.noActive);
    if (!domain.trim()) return toast.error('Enter a domain');
    setLoading(true);
    try {
      let res;
      if (mode === 'resolve') {
        res = await dnsApi.resolve(session.id, domain.trim(), qtype);
      } else {
        res = await dnsApi.targetUrl(session.id, domain.trim(), qtype);
      }
      setResult(res);
      toast.success(t.general.success);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? t.general.error);
    } finally {
      setLoading(false);
    }
  };

  const isTargetResult = result && 'targetUrl' in result;

  return (
    <div className="space-y-8">
      <SectionHeader title={t.dns.title} subtitle={t.dns.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Query form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <Input
              label={t.dns.domainLabel}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleResolve()}
              placeholder="bank.lab"
            />
            <Select
              label={t.dns.typeLabel}
              value={qtype}
              onChange={e => setQtype(e.target.value as QueryType)}
            >
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
            </Select>

            <div className="flex flex-col gap-2">
              <Button
                variant={mode === 'resolve' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => { setMode('resolve'); handleResolve(); }}
                loading={loading && mode === 'resolve'}
                className="w-full"
              >
                <Search size={13} />
                {t.dns.resolveBtn}
              </Button>
              <Button
                variant={mode === 'target' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => { setMode('target'); handleResolve(); }}
                loading={loading && mode === 'target'}
                className="w-full"
              >
                <ExternalLink size={13} />
                {t.dns.targetUrlBtn}
              </Button>
            </div>
          </Card>

          {/* Current session info */}
          {session && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">{t.general.mode}</span>
                <ModeBadge mode={session.mode} />
              </div>
              <p className="text-xs font-mono text-gray-600 mt-2 break-all">{session.id}</p>
            </Card>
          )}
        </div>

        {/* Result */}
        <div className="lg:col-span-3">
          {result ? (
            <Card className="p-5 space-y-4" glow={!!result.alert}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-white">{t.dns.result}</h3>
                <div className="flex gap-2">
                  <ModeBadge mode={result.mode} />
                  <ActionBadge action={result.finalAction} />
                </div>
              </div>

              {result.alert && (
                <AlertBanner
                  title={t.dns.alert}
                  message={result.alert.reason}
                  variant={result.finalAction === 'BLOCK' ? 'danger' : 'warn'}
                />
              )}

              <div className="grid grid-cols-2 gap-3 text-sm font-mono">
                {[
                  [t.general.domain, result.name],
                  [t.general.type, result.type],
                  [t.general.resolver, result.resolver],
                  [t.dns.raw, result.answer ?? '-'],
                  [t.general.ttl, result.ttl ?? '-'],
                  [t.general.latency, result.rttMs !== null ? `${result.rttMs}ms` : '-'],
                  [t.dns.finalAnswer, result.finalAnswer ?? (result.finalAction === 'BLOCK' ? '✗ BLOCKED' : '-')],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">{k}</span>
                    <span className={`text-gray-100 ${k === t.dns.finalAnswer && result.finalAction === 'BLOCK' ? 'text-danger-400' : ''}`}>
                      {v as string}
                    </span>
                  </div>
                ))}
              </div>

              {isTargetResult && (result as TargetUrlResult).targetUrl && (
                <div className="border border-cyber-500/30 bg-cyber-500/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-mono mb-1">{t.dns.targetUrl}</p>
                  <a
                    href={(result as TargetUrlResult).targetUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyber-400 hover:text-cyber-300 font-mono text-sm flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink size={13} />
                    {(result as TargetUrlResult).targetUrl}
                  </a>
                </div>
              )}

              {isTargetResult && !(result as TargetUrlResult).targetUrl && result.finalAction !== 'BLOCK' && (
                <AlertBanner message={(result as TargetUrlResult).reason ?? 'No target URL mapping found'} variant="info" />
              )}

              <div>
                <p className="text-xs text-gray-500 font-mono mb-1">RAW JSON</p>
                <CodeBlock data={result} />
              </div>
            </Card>
          ) : (
            <Card className="p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Search size={28} className="text-gray-600" />
              </div>
              <div>
                <p className="text-gray-400 font-body">{session ? 'Enter a domain and resolve' : t.sessions.noActive}</p>
                <p className="text-gray-600 text-sm font-mono mt-1">bank.lab · shop.lab</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
