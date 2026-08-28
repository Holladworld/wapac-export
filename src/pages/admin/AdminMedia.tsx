import { useEffect, useState, useCallback } from 'react';
import { Loader2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { type MediaItem } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('media_library', { orderBy: 'created_at', ascending: false });
    setMedia(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setAdding(true);
    const fileName = url.split('/').pop() || 'image';
    await adminApi.insert('media_library', {
      url: url.trim(), file_name: fileName, file_type: 'image', alt_text: fileName,
    });
    setAdding(false);
    setUrl('');
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    await adminApi.delete('media_library', id);
    load();
  };

  const filtered = media.filter((m) => m.file_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Media Library</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage images and media assets.</p>
      </div>
      <div className="flex gap-3">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1 px-3 py-2 text-sm border outline-none" style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
        <button onClick={handleAdd} disabled={adding} className="flex items-center gap-2 px-4 py-2 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          {adding ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} Add
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Search size={16} style={{ color: 'var(--tcf-secondary-text)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media..." className="flex-1 px-3 py-2 text-sm border outline-none" style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No media items found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="aspect-square overflow-hidden">
                <img src={item.url} alt={item.alt_text || item.file_name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs truncate" style={{ color: 'var(--tcf-text)' }}>{item.file_name}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
