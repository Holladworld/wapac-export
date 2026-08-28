import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToInquiry = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      price_at_purchase: Number(product.bulk_price_per_unit) || 0,
      unit_name: product.bulk_unit_name || 'ton',
      image_url: product.image_url,
    });
  };

  return (
    <div
      className="group border transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: 'var(--tcf-card)',
        borderColor: 'var(--tcf-border)',
      }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden" style={{ backgroundColor: 'var(--tcf-bg)' }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--tcf-accent)' }}>
            {product.category}
          </span>
          {product.grade && (
            <span className="text-[10px] px-2 py-0.5 border" style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-secondary-text)' }}>
              {product.grade}
            </span>
          )}
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-bold mb-2 transition-colors group-hover:opacity-80" style={{ color: 'var(--tcf-text)' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--tcf-secondary-text)' }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>
              ${Number(product.bulk_price_per_unit || 0).toFixed(0)}
            </span>
            <span className="text-sm ml-1" style={{ color: 'var(--tcf-secondary-text)' }}>
              / {product.bulk_unit_name || 'ton'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToInquiry}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
          >
            <Plus size={14} /> Add to Inquiry
          </button>
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center px-4 py-2.5 text-xs tracking-wide uppercase font-medium border transition-all duration-300 hover:opacity-80"
            style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }}
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
