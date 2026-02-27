import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { eventsApi } from '../api';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, Select, SectionHeader, SeverityBadge, EmptyState, Spinner } from '../components/ui';
import type { Event } from '../types';

function EventRow({ ev }: { ev: Event }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-800/50 last:border-0">
      <div
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/30 cursor-pointer transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          ev.severity === 'ALERT' ? 'bg-danger-500 shadow-[0_0_6px_#ef4444]' :
          ev.severity === 'WARN' ? 'bg-warn-500 shadow-[0_0_6px_#f59e0b]' : 'bg-cyber-500'
        }`} />
        <span className="text-[11px] text-gray-500 font-mono flex-shrink-0 w-[130px]">
          {new Date(ev.ts).toLocaleString()}
        </span>
        <SeverityBadge severity={ev.severity} />
        <span className="font-mono text-xs text-gray-200 flex-1 truncate">{ev.type}</span>
        {ev.payload && (
          <span className="text-gray-600 flex-shrink-0">
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
        )}
      </div>
      {open && ev.payload && (
        <div className="px-4 pb-3">
          <pre className="bg-black/40 border border-gray-800 rounded-lg p-3 text-xs font-mono text-cyber-300 overflow-x-auto">
            {JSON.stringify(ev.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const { session } = useSession();
  const { t } = useLang();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(100);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const fetchEvents = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const list = await eventsApi.list(session.id, take);
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }, [session, take]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = filterSeverity === 'ALL' ? events : events.filter(e => e.severity === filterSeverity);

  const counts = {
    ALERT: events.filter(e => e.severity === 'ALERT').length,
    WARN: events.filter(e => e.severity === 'WARN').length,
    INFO: events.filter(e => e.severity === 'INFO').length,
  };

  return (
    <div className="space-y-8">
      <SectionHeader title={t.events.title} subtitle={t.events.subtitle} />

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        {(['ALERT', 'WARN', 'INFO'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(f => f === sev ? 'ALL' : sev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              filterSeverity === sev
                ? sev === 'ALERT' ? 'bg-danger-500/20 border-danger-500/50 text-danger-400'
                  : sev === 'WARN' ? 'bg-warn-500/20 border-warn-500/50 text-warn-400'
                  : 'bg-cyber-500/20 border-cyber-500/50 text-cyber-400'
                : 'bg-transparent border-gray-700/50 text-gray-500 hover:border-gray-600'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              sev === 'ALERT' ? 'bg-danger-500' : sev === 'WARN' ? 'bg-warn-500' : 'bg-cyber-500'
            }`} />
            {t.events.severities[sev]} ({counts[sev]})
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Select value={String(take)} onChange={e => setTake(Number(e.target.value))} className="py-1 text-xs">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </Select>
          <Button variant="ghost" size="sm" onClick={fetchEvents} loading={loading}>
            <RefreshCw size={12} />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 text-[10px] font-mono uppercase tracking-widest text-gray-500">
          <span className="w-1.5" />
          <span className="w-[130px]">{t.events.timestamp}</span>
          <span className="w-16">{t.events.severity}</span>
          <span className="flex-1">{t.events.eventType}</span>
          <span className="w-4">{t.events.payload}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Activity />} message={t.events.noEvents} />
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.map(ev => <EventRow key={ev.id} ev={ev} />)}
          </div>
        )}
      </Card>
    </div>
  );
}
