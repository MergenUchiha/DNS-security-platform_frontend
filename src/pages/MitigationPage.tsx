import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { mitigationApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, Input, Select, SectionHeader, EmptyState, Spinner, Badge } from '../components/ui';
import type { MitigationPolicy } from '../types';

export default function MitigationPage() {
  const { session } = useSession();
  const { t } = useLang();
  const [policies, setPolicies] = useState<MitigationPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [domain, setDomain] = useState('bank.lab');
  const [action, setAction] = useState<'BLOCK' | 'FORCE_SAFE_IP'>('FORCE_SAFE_IP');
  const [ips, setIps] = useState<string[]>(['172.20.0.11']);
  const [newIp, setNewIp] = useState('');

  const fetchPolicies = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const list = await mitigationApi.list(session.id);
      setPolicies(list);
    } catch {
      toast.error(t.general.error);
    } finally {
      setLoading(false);
    }
  }, [session, t]);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const handleAddIp = () => {
    const trimmed = newIp.trim();
    if (!trimmed) return;
    if (ips.includes(trimmed)) return;
    setIps(prev => [...prev, trimmed]);
    setNewIp('');
  };

  const handleRemoveIp = (ip: string) => {
    setIps(prev => prev.filter(i => i !== ip));
  };

  const handleSave = async () => {
    if (!session) return toast.error(t.sessions.noActive);
    if (!domain.trim()) return toast.error('Enter a domain');
    if (ips.length === 0) return toast.error('Add at least one IP');
    setSaving(true);
    try {
      await mitigationApi.upsert(session.id, { domain: domain.trim(), action, allowedIps: ips });
      await fetchPolicies();
      toast.success(t.general.success);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? t.general.error);
    } finally {
      setSaving(false);
    }
  };

  const loadPolicy = (p: MitigationPolicy) => {
    setDomain(p.domain);
    setAction(p.action);
    setIps([...p.allowedIps]);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title={t.mitigation.title} subtitle={t.mitigation.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-4">
            <h3 className="font-display font-semibold text-white text-sm">{t.mitigation.addPolicy}</h3>

            <Input
              label={t.mitigation.domain}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="bank.lab"
            />

            <Select
              label={t.mitigation.action}
              value={action}
              onChange={e => setAction(e.target.value as 'BLOCK' | 'FORCE_SAFE_IP')}
            >
              <option value="FORCE_SAFE_IP">{t.mitigation.FORCE_SAFE_IP}</option>
              <option value="BLOCK">{t.mitigation.BLOCK}</option>
            </Select>

            {/* IPs */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.mitigation.allowedIps}</label>
              <div className="space-y-1.5 mb-2">
                {ips.map(ip => (
                  <div key={ip} className="flex items-center justify-between bg-gray-800/60 rounded-md px-3 py-1.5">
                    <span className="font-mono text-xs text-cyber-400">{ip}</span>
                    <button onClick={() => handleRemoveIp(ip)} className="text-gray-600 hover:text-danger-400 transition-colors ml-2">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newIp}
                  onChange={e => setNewIp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddIp()}
                  placeholder={t.mitigation.ipPlaceholder}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleAddIp}>
                  <Plus size={13} />
                </Button>
              </div>
            </div>

            <Button variant="primary" onClick={handleSave} loading={saving} className="w-full">
              <Shield size={13} />
              {t.mitigation.save}
            </Button>
          </Card>
        </div>

        {/* Policies list */}
        <div className="lg:col-span-3">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white text-sm">{t.mitigation.policies}</h3>
              <Button variant="ghost" size="sm" onClick={fetchPolicies} loading={loading}>
                <RefreshCw size={12} />
                {t.general.refresh}
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : policies.length === 0 ? (
              <EmptyState icon={<Shield />} message={t.mitigation.noPolicies} />
            ) : (
              <div className="space-y-3">
                {policies.map(p => (
                  <div
                    key={p.id}
                    className="border border-gray-700/50 rounded-xl p-4 hover:border-cyber-500/30 transition-all cursor-pointer group"
                    onClick={() => loadPolicy(p)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-cyber-400">{p.domain}</span>
                          <Badge variant={p.action === 'BLOCK' ? 'alert' : 'warn'}>
                            {p.action === 'BLOCK' ? t.mitigation.BLOCK : t.mitigation.FORCE_SAFE_IP}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.allowedIps.map(ip => (
                            <span key={ip} className="bg-gray-800/80 text-gray-300 font-mono text-xs px-2 py-0.5 rounded">
                              {ip}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 font-mono group-hover:text-cyber-500 transition-colors">
                        click to edit
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
