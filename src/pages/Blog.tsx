import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Search, AlertCircle } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');

  useSEO({ title: 'Blog & Resources', description: 'Insights on charcoal export, agricultural commodities, and international trade from Nigeria.' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
        if (error) throw error;
        setPosts(data || []);
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = posts.filter((p) =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
            News & Resources
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
            Wapac Export Blog
          </h1>
          <p className="max-w-xl mx-auto mt-4 text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>
            Insights on charcoal export, agricultural commodities, and international trade from Nigeria.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
          ) : fetchError ? (
            <div className="text-center py-20">
              <AlertCircle size={36} className="mx-auto mb-4" style={{ color: 'var(--tcf-secondary-text)' }} />
              <p className="text-sm mb-2" style={{ color: 'var(--tcf-text)' }}>Failed to load blog posts.</p>
              <button onClick={() => window.location.reload()} className="text-sm" style={{ color: 'var(--tcf-accent)' }}>
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No blog posts published yet.</p>
          ) : (
            <>
              <div className="relative mb-8 max-w-md mx-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--tcf-secondary-text)' }} />
                <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
                <input id="blog-search" type="text" value={search}
                  onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 text-sm border outline-none transition-colors"
                  style={{ backgroundColor: 'var(--tcf-card)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
              </div>
              {filtered.length === 0 ? (
                <p className="text-center text-sm py-12" style={{ color: 'var(--tcf-secondary-text)' }}>No articles match your search.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group transition-all duration-300 hover:shadow-xl"
                      style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}
                    >
                      <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--tcf-bg)' }}>
                        {post.hero_image_url && (
                          <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="p-6">
                        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--tcf-accent)' }}>
                          {post.category || 'General'}
                        </span>
                        <h3 className="font-serif text-xl font-bold mt-2 mb-3 transition-colors group-hover:opacity-80" style={{ color: 'var(--tcf-text)' }}>
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--tcf-secondary-text)' }}>
                          {post.excerpt || post.body.substring(0, 150)}
                        </p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--tcf-accent)' }}>
                          Read More <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
