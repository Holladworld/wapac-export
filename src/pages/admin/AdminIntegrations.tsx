import { useEffect, useState, useCallback } from 'react';
import { Loader2, Save, Check, Plug, AlertCircle } from 'lucide-react';
import { type Integration } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminApi.select('integrations', { orderBy: 'display_name' });
      setIntegrations(data || []);
    } catch {
      setError('Failed to load integrations. Please refresh the page.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (int: Integration, apiKey: string, webhookUrl: string) => {
    setSavingId(int.id);
    setError('');
    try {
      await adminApi.update('integrations', int.id, { api_key_encrypted: apiKey || null, webhook_url: webhookUrl || null, updated_at: new Date().toISOString() });
      setSavedId(int.id);
      setTimeout(() => setSavedId(null), 2000);
      load();
    } catch {
      setError('Failed to save integration. Please try again.');
    }
    setSavingId(null);
  };

  const toggleEnabled = async (int: Integration) => {
    setError('');
    try {
      await adminApi.update('integrations', int.id, { enabled: !int.enabled });
      load();
    } catch {
      setError('Failed to toggle integration.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Integrations</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Configure third-party services and API keys.</p>
      </div>
      {error && (
        <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {integrations.map((int) => (
            <IntegrationCard key={int.id} integration={int} onSave={handleSave} onToggle={toggleEnabled} saving={savingId === int.id} saved={savedId === int.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ integration, onSave, onToggle, saving, saved }: {
  integration: Integration; onSave: (int: Integration, apiKey: string, webhookUrl: string) => void;
  onToggle: (int: Integration) => void; saving: boolean; saved: boolean;
}) {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState(integration.webhook_url || '');

  const maskedKey = integration.api_key_encrypted || '';

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center ${integration.enabled ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
            <Plug size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--tcf-text)' }}>{integration.display_name}</h3>
            <span className="text-xs" style={{ color: integration.enabled ? '#16a34a' : 'var(--tcf-secondary-text)' }}>{integration.enabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <button onClick={() => onToggle(integration)} aria-label={`Toggle ${integration.display_name}`} className={`relative w-11 h-6 rounded-full transition-colors ${integration.enabled ? 'bg-green-500' : 'bg-zinc-300'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${integration.enabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label htmlFor={`api-key-${integration.id}`} className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
            API Key {maskedKey && <span className="normal-case opacity-60">(current: {maskedKey})</span>}
          </label>
          <input id={`api-key-${integration.id}`} type="password" value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter new API key to replace..."
            className="w-full px-3 py-2 text-sm border outline-none"
            style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
        </div>
        <div>
          <label htmlFor={`webhook-${integration.id}`} className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
            Webhook URL
          </label>
          <input id={`webhook-${integration.id}`} type="text" value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://..."
            className="w-full px-3 py-2 text-sm border outline-none"
            style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
        </div>
        <button onClick={() => onSave(integration, apiKey, webhookUrl)} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-40"
          style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          {saved ? <Check size={14} /> : saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
