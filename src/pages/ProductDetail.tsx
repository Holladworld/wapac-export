import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Minus, Plus, Star, Check, AlertCircle, Loader2, ShoppingBag,
} from 'lucide-react';
import { supabase, type Product, type Review } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { validateEmail, validateRequired, validateMinLength } from '../lib/validation';
import { useSEO } from '../hooks/useSEO';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ author_name: '', author_email: '', rating: 5, title: '', body: '' });
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const moq = product ? Number(product.bulk_min_qty) || 1 : 1;

  useSEO({
    title: product ? product.name : 'Product',
    description: product?.description,
    ogImage: product?.image_url || undefined,
    ogType: 'product',
    jsonLd: product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image_url || undefined,
      category: product.category,
      brand: { '@type': 'Brand', name: 'Wapac Export' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: Number(product.bulk_price_per_unit || 0).toFixed(2),
        availability: 'https://schema.org/InStock',
      },
    } : undefined,
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const { data: prod, error: prodErr } = await supabase.from('products').select('*').eq('id', id).single();
        if (prodErr) throw prodErr;
        setProduct(prod);
        const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', id).eq('status', 'approved').order('created_at', { ascending: false });
        setReviews(revs || []);
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-40" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} />
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="py-40 text-center" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--tcf-secondary-text)' }} />
        <h1 className="font-serif text-2xl mb-2" style={{ color: 'var(--tcf-text)' }}>Product not found</h1>
        <Link to="/products" className="text-sm" style={{ color: 'var(--tcf-accent)' }}>← Back to Products</Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;

  const handleAddToInquiry = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      quantity: qty,
      price_at_purchase: Number(product.bulk_price_per_unit) || 0,
      unit_name: product.bulk_unit_name || 'ton',
      image_url: product.image_url,
    });
  };

  const validateReview = () => {
    const e: Record<string, string> = {};
    const nameCheck = validateRequired(reviewForm.author_name, 'Name');
    if (!nameCheck.valid) e.author_name = nameCheck.message!;
    const emailCheck = validateEmail(reviewForm.author_email);
    if (!emailCheck.valid) e.author_email = emailCheck.message!;
    const bodyCheck = validateMinLength(reviewForm.body, 10, 'Review');
    if (!bodyCheck.valid) e.body = bodyCheck.message!;
    setReviewErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReview()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: product.id,
        author_name: reviewForm.author_name.trim(),
        author_email: reviewForm.author_email.trim(),
        rating: reviewForm.rating,
        title: reviewForm.title.trim() || null,
        body: reviewForm.body.trim(),
        status: 'pending',
      });
      if (error) throw error;
      setReviewSubmitted(true);
      setReviewForm({ author_name: '', author_email: '', rating: 5, title: '', body: '' });
      setTimeout(() => setReviewSubmitted(false), 4000);
    } catch {
      setReviewError('Failed to submit review. Please try again.');
    }
    setSubmittingReview(false);
  };

  const inputStyle = (field: string) => ({
    backgroundColor: 'var(--tcf-primary)',
    borderColor: reviewErrors[field] ? '#dc2626' : 'var(--tcf-border)',
    color: 'var(--tcf-text)',
  });

  return (
    <div style={{ backgroundColor: 'var(--tcf-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-colors mb-8 hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square border overflow-hidden" style={{ borderColor: 'var(--tcf-border)', backgroundColor: 'var(--tcf-card)' }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--tcf-secondary-text)' }}>No image</div>
            )}
          </div>

          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--tcf-accent)' }}>{product.category}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--tcf-text)' }}>{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex" aria-label={`Rating: ${avgRating.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= Math.round(avgRating) ? 'fill-current' : ''} style={{ color: star <= Math.round(avgRating) ? 'var(--tcf-accent)' : 'var(--tcf-border)' }} />
                ))}
              </div>
              <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>
                {reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews yet'}
              </span>
            </div>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>{product.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-baseline gap-2 pb-4" style={{ borderBottom: '1px solid var(--tcf-border)' }}>
                <span className="text-xs tracking-wide uppercase" style={{ color: 'var(--tcf-secondary-text)' }}>Bulk Price:</span>
                <span className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>${Number(product.bulk_price_per_unit || 0).toFixed(0)}</span>
                <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>/ {product.bulk_unit_name || 'ton'}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--tcf-secondary-text)' }}>MOQ: {product.bulk_min_qty} {product.bulk_unit_name}</span>
              </div>
              {Number(product.branded_price_per_unit) > 0 && (
                <div className="flex items-baseline gap-2 pb-4" style={{ borderBottom: '1px solid var(--tcf-border)' }}>
                  <span className="text-xs tracking-wide uppercase" style={{ color: 'var(--tcf-secondary-text)' }}>Branded:</span>
                  <span className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>${Number(product.branded_price_per_unit).toFixed(0)}</span>
                  <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>/ {product.branded_unit_name}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--tcf-secondary-text)' }}>MOQ: {product.branded_min_qty} {product.branded_unit_name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border" style={{ borderColor: 'var(--tcf-border)' }}>
                <button onClick={() => setQty(Math.max(moq, qty - 1))} aria-label="Decrease quantity" className="p-3 transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium" style={{ color: 'var(--tcf-text)' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity" className="p-3 transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToInquiry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
              >
                <ShoppingBag size={16} /> Add to Inquiry
              </button>
            </div>
            {qty < moq && (
              <p className="text-xs mb-4" style={{ color: 'var(--tcf-accent)' }}>
                Minimum order quantity is {moq} {product.bulk_unit_name || 'units'}.
              </p>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="p-6 border" style={{ borderColor: 'var(--tcf-border)' }}>
                <h3 className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--tcf-accent)' }}>Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <dt style={{ color: 'var(--tcf-secondary-text)' }}>{key}</dt>
                      <dd className="font-medium" style={{ color: 'var(--tcf-text)' }}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--tcf-text)' }}>Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No reviews yet. Be the first to review this product.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border p-5" style={{ borderColor: 'var(--tcf-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--tcf-text)' }}>{review.author_name}</span>
                      <div className="flex" aria-label={`Rating: ${review.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= (review.rating || 0) ? 'fill-current' : ''} style={{ color: s <= (review.rating || 0) ? 'var(--tcf-accent)' : 'var(--tcf-border)' }} />
                        ))}
                      </div>
                    </div>
                    {review.title && <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--tcf-text)' }}>{review.title}</h4>}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{review.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--tcf-text)' }}>Write a Review</h2>
            {reviewSubmitted ? (
              <div className="border p-6 text-center" style={{ borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <Check size={32} className="mx-auto mb-3" style={{ color: '#16a34a' }} />
                <p className="font-medium mb-1" style={{ color: 'var(--tcf-text)' }}>Review Submitted!</p>
                <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Your review is pending approval and will appear once approved by our team.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                    <AlertCircle size={16} /> {reviewError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rev-name" className="sr-only">Your Name</label>
                    <input id="rev-name" type="text" placeholder="Your Name *" value={reviewForm.author_name}
                      onChange={(e) => { setReviewForm({ ...reviewForm, author_name: e.target.value }); setReviewErrors({ ...reviewErrors, author_name: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('author_name')} />
                    {reviewErrors.author_name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{reviewErrors.author_name}</span>}
                  </div>
                  <div>
                    <label htmlFor="rev-email" className="sr-only">Email</label>
                    <input id="rev-email" type="email" placeholder="Email *" value={reviewForm.author_email}
                      onChange={(e) => { setReviewForm({ ...reviewForm, author_email: e.target.value }); setReviewErrors({ ...reviewErrors, author_email: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('author_email')} />
                    {reviewErrors.author_email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{reviewErrors.author_email}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" aria-label={`Set rating to ${s} stars`} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                      <Star size={20} className={s <= reviewForm.rating ? 'fill-current' : ''} style={{ color: s <= reviewForm.rating ? 'var(--tcf-accent)' : 'var(--tcf-border)' }} />
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="rev-title" className="sr-only">Review Title</label>
                  <input id="rev-title" type="text" placeholder="Review Title" value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('title')} />
                </div>
                <div>
                  <label htmlFor="rev-body" className="sr-only">Your Review</label>
                  <textarea id="rev-body" placeholder="Your Review *" value={reviewForm.body}
                    onChange={(e) => { setReviewForm({ ...reviewForm, body: e.target.value }); setReviewErrors({ ...reviewErrors, body: '' }); }}
                    rows={4} className="w-full px-4 py-3 text-sm border outline-none transition-colors resize-none" style={inputStyle('body')} />
                  {reviewErrors.body && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{reviewErrors.body}</span>}
                </div>
                <button type="submit" disabled={submittingReview}
                  className="flex items-center gap-2 px-6 py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                  {submittingReview ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
