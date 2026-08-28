import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

const LOGO_DARK = 'https://i.imgur.com/gCbqBgJ.png';
const LOGO_LIGHT = 'https://i.imgur.com/7Jl1UFC.png';

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? 'font-medium' : 'hover:opacity-80'
    }`;

  const navStyle = (isActive: boolean) => ({
    color: isActive ? 'var(--tcf-accent)' : 'var(--tcf-secondary-text)',
  });

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: 'var(--tcf-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={settings.logo_url || (theme === 'dark' ? LOGO_DARK : LOGO_LIGHT)}
              alt="Wapac Export"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden lg:block">
              <div className="font-serif text-lg font-bold leading-none" style={{ color: 'var(--tcf-text)' }}>
                {settings.site_name || 'Wapac Export'}
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--tcf-accent)' }}>
                {settings.site_tagline || 'West African Prime Allied Commodities'}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/products', label: 'Charcoal' },
              { to: '/allied-commodities', label: 'Allied Commodities' },
              { to: '/bulk-charcoal', label: 'Bulk Order' },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass}
                style={({ isActive }) => navStyle(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 transition-colors hover:opacity-80"
              style={{ color: 'var(--tcf-secondary-text)' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={openCart}
              aria-label={`Open inquiry cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
              className="relative flex items-center gap-2 px-4 py-2 border text-sm tracking-wide transition-all duration-300 hover:shadow-lg"
              style={{ borderColor: 'var(--tcf-accent)', color: 'var(--tcf-accent)' }}
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Inquiry</span>
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 text-white text-[10px] font-medium flex items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--tcf-button)' }}
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2"
              style={{ color: 'var(--tcf-text)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-6 flex flex-col gap-4 animate-fade-in">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/products', label: 'Charcoal' },
              { to: '/allied-commodities', label: 'Allied Commodities' },
              { to: '/bulk-charcoal', label: 'Bulk Order' },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass}
                style={({ isActive }) => navStyle(isActive)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
