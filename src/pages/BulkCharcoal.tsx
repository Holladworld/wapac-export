import { useState } from 'react';
import {
  ArrowRight, Package, Globe, ShieldCheck, FileText, Truck,
  Mail, Phone, MessageCircle, MapPin, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { validateEmail, validateRequired, validatePhone, validateMinLength } from '../lib/validation';
import { useSEO } from '../hooks/useSEO';

export default function BulkCharcoal() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', quantity: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useSEO({ title: 'Bulk Charcoal Supply', description: 'Wholesale charcoal supplier and bulk export from Nigeria. Hardwood, bamboo, and coconut shell charcoal in container loads.' });

  const validate = () => {
    const e: Record<string, string> = {};
    const nameCheck = validateRequired(form.name, 'Name');
    if (!nameCheck.valid) e.name = nameCheck.message!;
    const emailCheck = validateEmail(form.email);
    if (!emailCheck.valid) e.email = emailCheck.message!;
    const phoneCheck = validatePhone(form.phone);
    if (!phoneCheck.valid) e.phone = phoneCheck.message!;
    const msgCheck = validateMinLength(form.message, 10, 'Message');
    if (!msgCheck.valid) e.message = msgCheck.message!;
    if (!form.quantity.trim()) e.quantity = 'Quantity is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim() || null,
        subject: `Bulk Order Inquiry - ${form.quantity} tons`,
        message: form.message.trim(),
        status: 'new',
      });
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: '', email: '', company: '', phone: '', quantity: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitError('Failed to submit. Please try again or contact us directly.');
    }
    setSubmitting(false);
  };

  const inputStyle = (field: string) => ({
    backgroundColor: 'var(--tcf-primary)',
    borderColor: errors[field] ? '#dc2626' : 'var(--tcf-border)',
    color: 'var(--tcf-text)',
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/37140017/pexels-photo-37140017.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium text-orange-400 inline-block mb-4">
              Wholesale & Bulk Export
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white mb-6">
              Wholesale Charcoal Supplier<br />& Bulk Export from Nigeria
            </h1>
            <p className="text-lg leading-relaxed text-zinc-300 mb-8 max-w-xl">
              Reliable Nigerian wholesale charcoal supplier offering hardwood, bamboo, and coconut shell charcoal in bulk.
              Consistent quality, long burn time, low ash — ideal for BBQ, shisha & global export from Lagos ports.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Package, title: 'Container Loads', desc: '18MT per 20GP container. MOQ from 1 container.' },
            { icon: ShieldCheck, title: 'Quality Assured', desc: 'SGS inspection, fixed carbon >80%, low ash content.' },
            { icon: Truck, title: 'Global Shipping', desc: 'Sea & air freight with full export documentation.' },
          ].map((item, idx) => (
            <div key={idx} className="p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
                <item.icon size={22} className="text-white" />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2" style={{ color: 'var(--tcf-text)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact + Form */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>Get a Bulk Quote</h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>
              Export-ready worldwide from Nigerian ports. Sea & air shipping support with complete export documentation including certificate of origin and phytosanitary certificates.
            </p>
            <div className="space-y-4">
              <a href={`mailto:${settings.contact_email || 'wapacexport@gmail.com'}`} className="flex items-center gap-3 transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                <Mail size={18} className="shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <span>{settings.contact_email || 'wapacexport@gmail.com'}</span>
              </a>
              <a href={`tel:${(settings.contact_phone || '+234 803 000 0000').replace(/\s/g, '')}`} className="flex items-center gap-3 transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                <Phone size={18} className="shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <span>{settings.contact_phone || '+234 803 000 0000'}</span>
              </a>
              <a href="https://wa.me/2348030000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                <MessageCircle size={18} className="shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <span>Connect on WhatsApp</span>
              </a>
              <div className="flex items-center gap-3" style={{ color: 'var(--tcf-secondary-text)' }}>
                <MapPin size={18} className="shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <span>{settings.contact_address || 'Lagos, Nigeria'}</span>
              </div>
            </div>
          </div>

          <div className="p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#16a34a' }} />
                <h3 className="font-medium text-lg mb-2" style={{ color: 'var(--tcf-text)' }}>Request Submitted!</h3>
                <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Our export team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                    <AlertCircle size={16} /> {submitError}
                  </div>
                )}
                <div>
                  <label htmlFor="bulk-name" className="sr-only">Full Name</label>
                  <input id="bulk-name" type="text" placeholder="Full Name *" value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('name')} />
                  {errors.name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.name}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bulk-email" className="sr-only">Email</label>
                    <input id="bulk-email" type="email" placeholder="Email *" value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('email')} />
                    {errors.email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.email}</span>}
                  </div>
                  <div>
                    <label htmlFor="bulk-phone" className="sr-only">Phone</label>
                    <input id="bulk-phone" type="tel" placeholder="Phone" value={form.phone}
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('phone')} />
                    {errors.phone && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.phone}</span>}
                  </div>
                </div>
                <div>
                  <label htmlFor="bulk-company" className="sr-only">Company</label>
                  <input id="bulk-company" type="text" placeholder="Company" value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('company')} />
                </div>
                <div>
                  <label htmlFor="bulk-qty" className="sr-only">Quantity in tons</label>
                  <input id="bulk-qty" type="number" placeholder="Quantity (tons) *" value={form.quantity}
                    onChange={(e) => { setForm({ ...form, quantity: e.target.value }); setErrors({ ...errors, quantity: '' }); }}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('quantity')} min="1" />
                  {errors.quantity && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.quantity}</span>}
                </div>
                <div>
                  <label htmlFor="bulk-message" className="sr-only">Your Message</label>
                  <textarea id="bulk-message" placeholder="Your Message *" value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                    rows={4} className="w-full px-4 py-3 text-sm border outline-none transition-colors resize-y" style={inputStyle('message')} />
                  {errors.message && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.message}</span>}
                </div>
                <button type="submit" disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  {submitting ? 'Sending...' : 'Request Bulk Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
