import { useEffect, useState, useCallback } from 'react';
import { Loader2, Trash2, Mail, Phone, Building } from 'lucide-react';
import { type ContactSubmission } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('contact_submissions', { orderBy: 'created_at', ascending: false });
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await adminApi.delete('contact_submissions', id);
    load();
  };

  const updateStatus = async (msg: ContactSubmission, status: string) => {
    await adminApi.update('contact_submissions', msg.id, { status });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Messages</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Contact form submissions and inquiries.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : messages.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="p-5" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm" style={{ color: 'var(--tcf-text)' }}>{msg.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>
                    <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>}
                    {msg.company && <span className="flex items-center gap-1"><Building size={12} /> {msg.company}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={msg.status} onChange={(e) => updateStatus(msg, e.target.value)} className="text-xs px-2 py-1 border" style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }}>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button onClick={() => handleDelete(msg.id)} style={{ color: '#dc2626' }}><Trash2 size={14} /></button>
                </div>
              </div>
              {msg.subject && <p className="text-xs font-medium mb-1" style={{ color: 'var(--tcf-accent)' }}>{msg.subject}</p>}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{msg.message}</p>
              <p className="text-xs mt-2" style={{ color: 'var(--tcf-secondary-text)' }}>{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
