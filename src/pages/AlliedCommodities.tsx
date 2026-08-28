import { useEffect, useState } from 'react';
import { Loader2, Filter, Search, AlertCircle } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useSEO } from '../hooks/useSEO';

export default function AlliedCommodities() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useSEO({ title: 'Allied Commodities', description: 'Premium Nigerian cocoa, cashew nuts, ginger, and soya beans for global export.' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const { data, error } = await supabase.from('products').select('*').eq('service_type', 'allied').order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter((p) => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
            Nigerian Agricultural Exports
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
            Allied Commodities
          </h1>
          <p className="max-w-xl mx-auto mt-4 text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>
            Premium cocoa, cashew nuts, ginger, and soya beans — sourced directly from Nigerian farms and exported worldwide.
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
              <p className="text-sm mb-2" style={{ color: 'var(--tcf-text)' }}>Failed to load products.</p>
              <button onClick={() => window.location.reload()} className="text-sm" style={{ color: 'var(--tcf-accent)' }}>
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No products available.</p>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <Filter size={16} style={{ color: 'var(--tcf-secondary-text)' }} />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className="px-4 py-2 text-xs tracking-wide uppercase font-medium whitespace-nowrap transition-all duration-300"
                      style={{
                        backgroundColor: category === cat ? 'var(--tcf-button)' : 'var(--tcf-card)',
                        color: category === cat ? 'var(--tcf-button-text)' : 'var(--tcf-secondary-text)',
                        border: '1px solid var(--tcf-border)',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative md:ml-auto md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--tcf-secondary-text)' }} />
                  <label htmlFor="allied-search" className="sr-only">Search commodities</label>
                  <input id="allied-search" type="text" value={search}
                    onChange={(e) => setSearch(e.target.value)} placeholder="Search commodities..."
                    className="w-full pl-10 pr-4 py-2 text-sm border outline-none transition-colors"
                    style={{ backgroundColor: 'var(--tcf-card)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
                </div>
              </div>
              {filtered.length === 0 ? (
                <p className="text-center text-sm py-12" style={{ color: 'var(--tcf-secondary-text)' }}>
                  No products match your search.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
