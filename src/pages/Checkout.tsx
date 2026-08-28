import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { validateEmail, validateRequired, validateMinLength } from '../lib/validation';
import { useSEO } from '../hooks/useSEO';

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '', contact_name: '', contact_email: '',
    vat_number: '', shipping_address: '', payment_method: 'T/T Bank Transfer',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useSEO({ title: 'Request Quote', description: 'Submit your bulk charcoal inquiry and receive a detailed quote within 24 hours.' });

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="py-40 text-center" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--tcf-secondary-text)' }} />
        <h1 className="font-serif text-2xl mb-2" style={{ color: 'var(--tcf-text)' }}>Your inquiry cart is empty</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--tcf-secondary-text)' }}>Add products to request a quote.</p>
        <Link to="/products" className="inline-block px-6 py-3 text-sm tracking-wide uppercase font-medium transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="py-40 text-center" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <CheckCircle2 size={64} className="mx-auto mb-6" style={{ color: '#16a34a' }} />
        <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--tcf-text)' }}>Quote Request Submitted!</h1>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--tcf-secondary-text)' }}>
          Our export team will review your inquiry and send a detailed quote within 24 hours.
        </p>
        <Link to="/" className="inline-block px-8 py-3 text-sm tracking-wide uppercase font-medium transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    const companyCheck = validateRequired(form.company_name, 'Company name');
    if (!companyCheck.valid) e.company_name = companyCheck.message!;
    const nameCheck = validateRequired(form.contact_name, 'Contact name');
    if (!nameCheck.valid) e.contact_name = nameCheck.message!;
    const emailCheck = validateEmail(form.contact_email);
    if (!emailCheck.valid) e.contact_email = emailCheck.message!;
    const addrCheck = validateMinLength(form.shipping_address, 10, 'Shipping address');
    if (!addrCheck.valid) e.shipping_address = addrCheck.message!;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const totalTons = items.reduce((sum, item) => sum + item.quantity, 0);
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        company_name: form.company_name.trim(),
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        vat_number: form.vat_number.trim() || null,
        shipping_address: form.shipping_address.trim(),
        payment_method: form.payment_method,
        total_price: totalPrice,
        total_tons: totalTons,
        status: 'Pending',
      }).select().single();

      if (orderError || !order) throw new Error('Failed to create order');

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        unit_name: item.unit_name,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error('Failed to save order items');

      setOrderComplete(true);
      clearCart();
    } catch {
      setSubmitError('Something went wrong submitting your request. Please try again or contact us directly.');
    }
    setSubmitting(false);
  };

  const inputStyle = (field: string) => ({
    backgroundColor: 'var(--tcf-primary)',
    borderColor: errors[field] ? '#dc2626' : 'var(--tcf-border)',
    color: 'var(--tcf-text)',
  });

  return (
    <div style={{ backgroundColor: 'var(--tcf-bg)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-colors mb-8 hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--tcf-text)' }}>Request Quote</h1>

        {submitError && (
          <div className="mb-6 p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626' }}>
            <AlertCircle size={18} style={{ color: '#dc2626' }} />
            <span className="text-sm" style={{ color: '#dc2626' }}>{submitError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-xl font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>Order Summary ({totalItems} items)</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4 pb-4 border-b" style={{ borderColor: 'var(--tcf-border)' }}>
                  <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--tcf-card)' }}>
                    {item.image_url && <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1" style={{ color: 'var(--tcf-text)' }}>{item.product_name}</p>
                    <p className="text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>
                      {item.quantity} {item.unit_name} × ${Number(item.price_at_purchase).toFixed(0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm" style={{ color: 'var(--tcf-text)' }}>
                      ${(item.quantity * item.price_at_purchase).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--tcf-border)' }}>
              <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Estimated Total</span>
              <span className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>${totalPrice.toFixed(0)}</span>
            </div>
          </div>

          <div className="p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company_name" className="sr-only">Company Name</label>
                <input id="company_name" type="text" placeholder="Company Name *" value={form.company_name}
                  onChange={(e) => { setForm({ ...form, company_name: e.target.value }); setErrors({ ...errors, company_name: '' }); }}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('company_name')} />
                {errors.company_name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.company_name}</span>}
              </div>
              <div>
                <label htmlFor="contact_name" className="sr-only">Contact Name</label>
                <input id="contact_name" type="text" placeholder="Contact Name *" value={form.contact_name}
                  onChange={(e) => { setForm({ ...form, contact_name: e.target.value }); setErrors({ ...errors, contact_name: '' }); }}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('contact_name')} />
                {errors.contact_name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.contact_name}</span>}
              </div>
              <div>
                <label htmlFor="contact_email" className="sr-only">Contact Email</label>
                <input id="contact_email" type="email" placeholder="Contact Email *" value={form.contact_email}
                  onChange={(e) => { setForm({ ...form, contact_email: e.target.value }); setErrors({ ...errors, contact_email: '' }); }}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('contact_email')} />
                {errors.contact_email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.contact_email}</span>}
              </div>
              <div>
                <label htmlFor="vat_number" className="sr-only">VAT Number</label>
                <input id="vat_number" type="text" placeholder="VAT Number (optional)" value={form.vat_number}
                  onChange={(e) => setForm({ ...form, vat_number: e.target.value })}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('vat_number')} />
              </div>
              <div>
                <label htmlFor="shipping_address" className="sr-only">Shipping Address</label>
                <textarea id="shipping_address" placeholder="Shipping Address *" value={form.shipping_address}
                  onChange={(e) => { setForm({ ...form, shipping_address: e.target.value }); setErrors({ ...errors, shipping_address: '' }); }}
                  rows={3} className="w-full px-4 py-3 text-sm border outline-none transition-colors resize-y" style={inputStyle('shipping_address')} />
                {errors.shipping_address && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.shipping_address}</span>}
              </div>
              <div>
                <label htmlFor="payment_method" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>Payment Method</label>
                <select id="payment_method" value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors"
                  style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }}>
                  <option>T/T Bank Transfer</option>
                  <option>FlutterWave</option>
                  <option>Paystack</option>
                  <option>Payoneer</option>
                  <option>Letter of Credit (L/C)</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
