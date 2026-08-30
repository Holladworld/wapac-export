import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Instagram, Linkedin, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { validateEmail } from '../lib/validation';

// 🔥 ADD LOGO CONSTANTS (same as Header)
const LOGO_DARK = 'https://i.imgur.com/PU5jooK.png';   // White logo for dark background
const LOGO_LIGHT = 'https://i.imgur.com/dddjbC5.png'; // Colored/black logo for light background

export default function Footer() {
  const { settings } = useSettings();
  const { theme } = useTheme(); // ← ADD THIS to get current theme
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitError('');
    const { valid, message } = validateEmail(email);
    if (!valid) {
      setError(message || 'Invalid email');
      return;
    }
    try {
      const { error: upsertError } = await supabase.from('newsletter_subscribers').upsert(
        { email: email.trim(), status: 'active' },
        { onConflict: 'email' }
      );
      if (upsertError) throw upsertError;
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      setSubmitError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--tcf-bg)', borderColor: 'var(--tcf-border)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={settings.logo_url || (theme === 'dark' ? LOGO_DARK : LOGO_LIGHT)}
                alt="Wapac Export"
                className="h-14 w-auto object-contain"
              />
              <div>
                <div className="font-serif text-lg font-bold leading-none" style={{ color: 'var(--tcf-text)' }}>
                  {settings.site_name || 'Wapac Export'}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--tcf-accent)' }}>
                  {settings.site_tagline || 'West African Prime Allied Commodities'}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--tcf-secondary-text)' }}>
              {settings.footer_about || 'Wapac Export is a leading Nigerian export company specializing in premium charcoal, cocoa, cashew nuts, ginger, and soya beans.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--tcf-accent)' }}>Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>Home</Link></li>
              <li><Link to="/all-products" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>All Products</Link></li>
              <li><Link to="/products" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>Charcoal Products</Link></li>
              <li><Link to="/allied-commodities" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>Allied Commodities</Link></li>
              <li><Link to="/bulk-charcoal" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>Bulk Order</Link></li>
              <li><Link to="/blog" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>Blog</Link></li>
              <li><Link to="/about" className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--tcf-accent)' }}>Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <a href={`mailto:${settings.contact_email || 'wapacexport@gmail.com'}`} className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                  {settings.contact_email || 'wapacexport@gmail.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <a href={`tel:${(settings.contact_phone || '+234 803 000 0000').replace(/\s/g, '')}`} className="transition-colors hover:opacity-80" style={{ color: 'var(--tcf-secondary-text)' }}>
                  {settings.contact_phone || '+234 803 000 0000'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--tcf-accent)' }} />
                <span style={{ color: 'var(--tcf-secondary-text)' }}>{settings.contact_address || 'Lagos, Nigeria'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--tcf-accent)' }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: 'var(--tcf-secondary-text)' }}>Get export pricing updates and product alerts.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#16a34a' }}>
                <CheckCircle2 size={16} /> Subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Newsletter email</label>
                <input id="newsletter-email" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); setSubmitError(''); }}
                  placeholder="Your email" required
                  className="px-3 py-2 text-sm border outline-none transition-colors"
                  style={{ backgroundColor: 'var(--tcf-primary)', borderColor: error ? '#dc2626' : 'var(--tcf-border)', color: 'var(--tcf-text)' }} />
                {error && <span className="text-xs" style={{ color: '#dc2626' }}>{error}</span>}
                {submitError && (
                  <span className="text-xs flex items-center gap-1" style={{ color: '#dc2626' }}>
                    <AlertCircle size={12} /> {submitError}
                  </span>
                )}
                <button type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all hover:shadow-lg hover:shadow-orange-500/20"
                  style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-xs"
          style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-secondary-text)' }}>
          <div className="flex flex-col gap-2">
            <p>{settings.footer_copyright || '© Wapac Export 2026. All Rights Reserved.'}</p>
            <p className="text-[11px]" style={{ color: 'var(--tcf-secondary-text)' }}>Powered by OTP Global Limited</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a href="https://www.tiktok.com/@wapacexport" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'var(--tcf-secondary-text)' }} aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.73 2.89 2.89 0 0 1 2.31-4.55c.3 0 .6.04.88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.12z"/></svg>
              </a>
              <a href="https://www.instagram.com/wapacexport" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'var(--tcf-secondary-text)' }} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/wapacexport" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'var(--tcf-secondary-text)' }} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
            <div className="flex gap-4">
              <span>SGS Certified</span>
              <span>ISO 9001</span>
              <span>Export Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}