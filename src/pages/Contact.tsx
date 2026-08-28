import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { validateEmail, validateRequired, validatePhone, validateMinLength } from '../lib/validation';
import { useSEO } from '../hooks/useSEO';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useSEO({ title: 'Contact Us', description: 'Contact Wapac Export for bulk charcoal supply, pricing, and export documentation from Nigeria.' });

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
        subject: form.subject.trim() || null,
        message: form.message.trim(),
        status: 'new',
      });
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitError('Failed to send message. Please try again or email us directly.');
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
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/220993/pexels-photo-220993.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Contact Wapac Export</h1>
            <p className="max-w-xl text-zinc-400 leading-relaxed">
              Have questions about bulk charcoal supply, pricing, or export documentation from Nigeria?
              Our export team responds within 24 hours. Reach out using the form below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="w-10 h-10 flex items-center justify-center border mb-4" style={{ borderColor: 'var(--tcf-accent)' }}>
                <Mail size={18} style={{ color: 'var(--tcf-accent)' }} />
              </div>
              <h3 className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--tcf-secondary-text)' }}>Email</h3>
              <a href={`mailto:${settings.contact_email || 'wapacexport@gmail.com'}`} className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--tcf-text)' }}>
                {settings.contact_email || 'wapacexport@gmail.com'}
              </a>
            </div>
            <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="w-10 h-10 flex items-center justify-center border mb-4" style={{ borderColor: 'var(--tcf-accent)' }}>
                <Phone size={18} style={{ color: 'var(--tcf-accent)' }} />
              </div>
              <h3 className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--tcf-secondary-text)' }}>Phone</h3>
              <a href={`tel:${(settings.contact_phone || '+234 803 000 0000').replace(/\s/g, '')}`} className="text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--tcf-text)' }}>
                {settings.contact_phone || '+234 803 000 0000'}
              </a>
            </div>
            <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="w-10 h-10 flex items-center justify-center border mb-4" style={{ borderColor: 'var(--tcf-accent)' }}>
                <MapPin size={18} style={{ color: 'var(--tcf-accent)' }} />
              </div>
              <h3 className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--tcf-secondary-text)' }}>Address</h3>
              <p className="text-sm" style={{ color: 'var(--tcf-text)' }}>{settings.contact_address || 'Lagos, Nigeria'}</p>
            </div>
            <a href="https://wa.me/2348030000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-6 transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: 'var(--tcf-accent)' }}>
                <MessageCircle size={18} style={{ color: 'var(--tcf-accent)' }} />
              </div>
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--tcf-secondary-text)' }}>WhatsApp</h3>
                <span className="text-sm" style={{ color: 'var(--tcf-text)' }}>Chat with us</span>
              </div>
            </a>
          </div>

          <div className="lg:col-span-2 p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#16a34a' }} />
                <h3 className="font-medium text-lg mb-2" style={{ color: 'var(--tcf-text)' }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Our export team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                    <AlertCircle size={16} /> {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <input id="name" type="text" placeholder="Full Name *" value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('name')} />
                    {errors.name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.name}</span>}
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input id="email" type="email" placeholder="Email *" value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('email')} />
                    {errors.email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.email}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="sr-only">Company</label>
                    <input id="company" type="text" placeholder="Company" value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('company')} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone</label>
                    <input id="phone" type="tel" placeholder="Phone" value={form.phone}
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('phone')} />
                    {errors.phone && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.phone}</span>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <input id="subject" type="text" placeholder="Subject" value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('subject')} />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" placeholder="Your Message *" value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                    rows={6} className="w-full px-4 py-3 text-sm border outline-none transition-colors resize-y" style={inputStyle('message')} />
                  {errors.message && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.message}</span>}
                </div>
                <button type="submit" disabled={submitting}
                  className="flex items-center justify-center gap-2 px-8 py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
