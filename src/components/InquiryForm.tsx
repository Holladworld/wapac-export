import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateEmail, validateRequired, validateMinLength } from '../lib/validation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InquiryForm({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    const nameCheck = validateRequired(form.name, 'Name');
    if (!nameCheck.valid) e.name = nameCheck.message!;
    const emailCheck = validateEmail(form.email);
    if (!emailCheck.valid) e.email = emailCheck.message!;
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
        subject: 'Quote Request from Landing Page',
        message: form.message.trim(),
        status: 'new',
      });
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: '', email: '', company: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch {
      setSubmitError('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  const inputStyle = (field: string) => ({
    backgroundColor: 'var(--tcf-primary)',
    borderColor: errors[field] ? '#dc2626' : 'var(--tcf-border)',
    color: 'var(--tcf-text)',
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Request a Quote"
          tabIndex={-1}
          className="w-full max-w-lg p-8 pointer-events-auto animate-slide-up outline-none"
          style={{ backgroundColor: 'var(--tcf-bg)', border: '1px solid var(--tcf-border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>
              Request a Quote
            </h2>
            <button onClick={onClose} aria-label="Close dialog" style={{ color: 'var(--tcf-secondary-text)' }} className="hover:opacity-80">
              <X size={22} />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#16a34a' }} />
              <h3 className="font-medium text-lg mb-2" style={{ color: 'var(--tcf-text)' }}>Request Submitted!</h3>
              <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>
                Our export team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                  <AlertCircle size={16} /> {submitError}
                </div>
              )}
              <div>
                <label htmlFor="inq-name" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
                  Full Name *
                </label>
                <input id="inq-name" type="text" value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('name')} />
                {errors.name && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.name}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-email" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
                    Email *
                  </label>
                  <input id="inq-email" type="email" value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('email')} />
                  {errors.email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.email}</span>}
                </div>
                <div>
                  <label htmlFor="inq-phone" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
                    Phone
                  </label>
                  <input id="inq-phone" type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('phone')} />
                </div>
              </div>
              <div>
                <label htmlFor="inq-company" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
                  Company
                </label>
                <input id="inq-company" type="text" value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 text-sm border outline-none transition-colors" style={inputStyle('company')} />
              </div>
              <div>
                <label htmlFor="inq-message" className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>
                  Message *
                </label>
                <textarea id="inq-message" value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                  rows={4} className="w-full px-4 py-3 text-sm border outline-none transition-colors resize-y" style={inputStyle('message')}
                  placeholder="Tell us about your requirements..." />
                {errors.message && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.message}</span>}
              </div>
              <button type="submit" disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
