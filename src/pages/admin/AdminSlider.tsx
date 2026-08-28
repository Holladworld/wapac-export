import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Edit, Trash2, X, Save, GripVertical, Image, Video } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

type Slide = {
  id: string;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  media_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('slider_slides', { orderBy: 'order_index', ascending: true });
    setSlides(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await adminApi.delete('slider_slides', id);
    load();
  };

  const toggleActive = async (slide: Slide) => {
    await adminApi.update('slider_slides', slide.id, { is_active: !slide.is_active });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Slider Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage the "See Us in Operation" slider slides.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {showForm && (
        <SlideForm 
          slide={editing} 
          onClose={() => setShowForm(false)} 
          onSaved={() => { setShowForm(false); load(); }} 
        />
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : slides.length === 0 ? (
        <div className="text-center py-12" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
          <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No slides added yet. Create your first slider slide above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-5 flex items-center justify-between" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded" style={{ backgroundColor: 'var(--tcf-bg)' }}>
                  {slide.media_type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--tcf-secondary-text)' }}>
                      <Video size={24} />
                    </div>
                  ) : (
                    <img src={slide.media_url} alt={slide.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm" style={{ color: 'var(--tcf-text)' }}>
                    {slide.title || 'Untitled Slide'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>
                    {slide.media_type} · Order: {slide.order_index} · {slide.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(slide)} className="text-xs px-2 py-1 border" style={{ borderColor: 'var(--tcf-border)', color: slide.is_active ? '#16a34a' : 'var(--tcf-secondary-text)' }}>
                  {slide.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => { setEditing(slide); setShowForm(true); }} className="p-2" style={{ color: 'var(--tcf-accent)' }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-2" style={{ color: '#dc2626' }}>
                  <Trash2 size={14} />
                </button>
                <div className="cursor-grab" style={{ color: 'var(--tcf-secondary-text)' }}>
                  <GripVertical size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SlideForm({ slide, onClose, onSaved }: { slide: Slide | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: slide?.title || '',
    description: slide?.description || '',
    media_type: slide?.media_type || 'image',
    media_url: slide?.media_url || '',
    order_index: slide?.order_index?.toString() || '0',
    is_active: slide?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = "w-full px-3 py-2 text-sm border outline-none";
  const inputStyle = { backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' };

  const handleSave = async () => {
    setError('');
    if (!form.media_url.trim()) {
      setError('Media URL is required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      order_index: Number(form.order_index) || 0,
    };
    if (slide) {
      await adminApi.update('slider_slides', slide.id, payload);
    } else {
      await adminApi.insert('slider_slides', payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--tcf-bg)', border: '1px solid var(--tcf-border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>{slide ? 'Edit Slide' : 'Add Slide'}</h2>
          <button onClick={onClose} style={{ color: 'var(--tcf-secondary-text)' }}><X size={20} /></button>
        </div>
        {error && (
          <div className="mb-4 p-3 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input className={inputClass} style={inputStyle} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          
          <select className={inputClass} style={inputStyle} value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value as 'image' | 'video' })}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          
          <input className={inputClass} style={inputStyle} placeholder="Media URL (image or video URL)" value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} />
          
          <input type="number" className={inputClass} style={inputStyle} placeholder="Order Index (0, 1, 2...)" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} />
          
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--tcf-text)' }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
          </label>
          
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? 'Saving...' : 'Save Slide'}
          </button>
        </div>
      </div>
    </div>
  );
}