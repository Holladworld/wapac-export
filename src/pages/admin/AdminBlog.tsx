import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { type BlogPost } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('blog_posts', { orderBy: 'created_at', ascending: false });
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await adminApi.delete('blog_posts', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage blog content.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          <Plus size={16} /> New Post
        </button>
      </div>
      {showForm && <PostForm post={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="p-5 flex items-center justify-between" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div>
                <h3 className="font-medium text-sm" style={{ color: 'var(--tcf-text)' }}>{post.title}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>{post.category} · {post.published ? 'Published' : 'Draft'} · {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(post); setShowForm(true); }} className="p-2" style={{ color: 'var(--tcf-accent)' }}><Edit size={14} /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2" style={{ color: '#dc2626' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostForm({ post, onClose, onSaved }: { post: BlogPost | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: post?.title || '', slug: post?.slug || '', excerpt: post?.excerpt || '', body: post?.body || '',
    hero_image_url: post?.hero_image_url || '', category: post?.category || 'General', author: post?.author || 'Admin',
    published: post?.published || false,
  });
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full px-3 py-2 text-sm border outline-none";
  const inputStyle = { backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' };

  const handleSave = async () => {
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug, published_at: form.published ? new Date().toISOString() : null };
    if (post) {
      await adminApi.update('blog_posts', post.id, payload);
    } else {
      await adminApi.insert('blog_posts', payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--tcf-bg)', border: '1px solid var(--tcf-border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>{post ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} style={{ color: 'var(--tcf-secondary-text)' }}><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <input className={inputClass} style={inputStyle} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="Slug (auto-generated if empty)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <textarea className={inputClass} style={inputStyle} placeholder="Body" rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input className={inputClass} style={inputStyle} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className={inputClass} style={inputStyle} placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <input className={inputClass} style={inputStyle} placeholder="Hero Image URL" value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} />
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--tcf-text)' }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
          </label>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
