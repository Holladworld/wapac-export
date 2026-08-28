import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, User, AlertCircle } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useSEO({
    title: post ? post.title : 'Blog Post',
    description: post?.excerpt || post?.body.substring(0, 160),
    ogImage: post?.hero_image_url || undefined,
    ogType: 'article',
    jsonLd: post ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.body.substring(0, 160),
      image: post.hero_image_url || undefined,
      author: { '@type': 'Person', name: post.author || 'Wapac Export' },
      publisher: { '@type': 'Organization', name: 'Wapac Export' },
      datePublished: post.published_at || post.created_at,
      dateModified: post.created_at,
    } : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
        if (error) throw error;
        setPost(data);
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-40" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} />
      </div>
    );
  }

  if (fetchError || !post) {
    return (
      <div className="py-40 text-center" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--tcf-secondary-text)' }} />
        <h1 className="font-serif text-2xl mb-4" style={{ color: 'var(--tcf-text)' }}>Post not found</h1>
        <Link to="/blog" className="text-sm" style={{ color: 'var(--tcf-accent)' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--tcf-bg)' }}>
      {post.hero_image_url && (
        <div className="w-full h-[40vh] overflow-hidden">
          <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <Link to="/blog" className="flex items-center gap-2 text-sm transition-colors mb-8 hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        <span className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
          {post.category || 'General'}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--tcf-text)' }}>{post.title}</h1>
        <div className="flex items-center gap-4 text-xs mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>
          {post.author && <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>}
          {post.published_at && <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString()}</span>}
        </div>
        {post.excerpt && <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>{post.excerpt}</p>}
        <article className="prose prose-sm max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--tcf-secondary-text)' }}>
          {post.body}
        </article>
      </div>
    </div>
  );
}
