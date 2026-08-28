import { useEffect, useState, useCallback } from 'react';
import { Loader2, Save, Check, Mail } from 'lucide-react';
import { type EmailTemplate } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminEmail() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('email_templates', { orderBy: 'display_name' });
    setTemplates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (template: EmailTemplate) => {
    setEditing(template);
    setForm({ subject: template.subject, body: template.body });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await adminApi.update('email_templates', editing.id, { subject: form.subject, body: form.body, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); }, 1500);
    load();
  };

  const toggleEnabled = async (template: EmailTemplate) => {
    await adminApi.update('email_templates', template.id, { enabled: !template.enabled });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Email & Notifications</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage automated email templates.</p>
      </div>
      <div className="p-5 flex items-start gap-3" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid var(--tcf-accent)' }}>
        <Mail size={20} style={{ color: 'var(--tcf-accent)' }} className="mt-0.5" />
        <div>
          <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--tcf-text)' }}>Admin Alert Notifications</h4>
          <p className="text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>New orders, contact submissions, and reviews trigger admin alerts. Configure the alert email in Site Settings.</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="p-5" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--tcf-text)' }}>{template.display_name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--tcf-secondary-text)' }}>Key: {template.template_key} · {template.enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleEnabled(template)} className={`relative w-11 h-6 rounded-full transition-colors ${template.enabled ? 'bg-green-500' : 'bg-zinc-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${template.enabled ? 'translate-x-5' : ''}`} />
                  </button>
                  <button onClick={() => startEdit(template)} className="px-4 py-1.5 text-sm border" style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }}>Edit</button>
                </div>
              </div>
              {editing?.id === template.id ? (
                <div className="space-y-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--tcf-border)' }}>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 text-sm border outline-none" style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
                  <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} className="w-full px-3 py-2 text-sm border outline-none resize-y font-mono" style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                      {saved ? <Check size={14} /> : saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border" style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-secondary-text)' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>Subject: <span style={{ color: 'var(--tcf-text)' }}>{template.subject}</span></div>
                  <div className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Body: <span style={{ color: 'var(--tcf-text)' }}>{template.body.substring(0, 100)}...</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
