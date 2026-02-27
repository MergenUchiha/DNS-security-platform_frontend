import { useState } from 'react';
import { Plus, StopCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from '../contexts/SessionContext';
import { useLang } from '../contexts/LangContext';
import { Card, Button, Badge, Input } from './ui';

export function SessionManager() {
  const { session, createSession, endSession, fetchCurrent, loading } = useSession();
  const { t } = useLang();
  const [note, setNote] = useState('');

  const handleCreate = async () => {
    try {
      await createSession(note || undefined);
      setNote('');
      toast.success(t.general.success);
    } catch {
      toast.error(t.general.error);
    }
  };

  const handleEnd = async () => {
    try {
      await endSession();
      toast.success(t.general.success);
    } catch {
      toast.error(t.general.error);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-white text-sm">{t.sessions.title}</h3>
        <Button variant="ghost" size="sm" onClick={fetchCurrent} loading={loading}>
          <RefreshCw size={12} />
        </Button>
      </div>

      {session ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="success">{t.general.active}</Badge>
            <span className="font-mono text-xs text-gray-400">{session.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400">
            <span>{t.sessions.created}:</span>
            <span className="text-gray-300">{new Date(session.createdAt).toLocaleString()}</span>
            <span>{t.general.mode}:</span>
            <span className="text-cyber-400">{session.mode}</span>
          </div>
          <Button variant="danger" size="sm" onClick={handleEnd} loading={loading} className="w-full">
            <StopCircle size={13} />
            {t.sessions.endSession}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-mono text-gray-500">{t.sessions.noActive}</p>
          <Input
            label={t.sessions.note}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t.sessions.note}
          />
          <Button variant="primary" size="sm" onClick={handleCreate} loading={loading} className="w-full">
            <Plus size={13} />
            {t.sessions.create}
          </Button>
        </div>
      )}
    </Card>
  );
}
