import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

const LOGO_DARK = 'https://i.imgur.com/PU5jooK.png';
const LOGO_LIGHT = 'https://i.imgur.com/dddjbC5.png';



export default function Header() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { to: '/', label: 'Home', end: true },
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

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm tracking-wide transition-colors hover:opacity-80"
                style={{ color: 'var(--tcf-secondary-text)' }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Products
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 py-2 rounded-md shadow-lg border"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                    borderColor: 'var(--tcf-border)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Link
                    to="/all-products"
                    className="block px-4 py-2 text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--tcf-text)' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    to="/products"
                    className="block px-4 py-2 text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--tcf-text)' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Charcoal
                  </Link>
                  <Link
                    to="/allied-commodities"
                    className="block px-4 py-2 text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--tcf-text)' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Allied Commodities
                  </Link>
                </div>
              )}
            </div>

            {[
              { to: '/bulk-charcoal', label: 'Bulk Order' },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden pb-6 flex flex-col gap-4 animate-fade-in">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              style={({ isActive }) => navStyle(isActive)}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            
            {/* Mobile Products Sub-menu */}
            <div className="pl-4 border-l-2" style={{ borderColor: 'var(--tcf-border)' }}>
              <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--tcf-secondary-text)' }}>
                Products
              </div>
              <div className="flex flex-col gap-3 pl-2">
                <NavLink
                  to="/all-products"
                  className={navLinkClass}
                  style={({ isActive }) => navStyle(isActive)}
                  onClick={() => setMobileOpen(false)}
                >
                  All Products
                </NavLink>
                <NavLink
                  to="/products"
                  className={navLinkClass}
                  style={({ isActive }) => navStyle(isActive)}
                  onClick={() => setMobileOpen(false)}
                >
                  Charcoal
                </NavLink>
                <NavLink
                  to="/allied-commodities"
                  className={navLinkClass}
                  style={({ isActive }) => navStyle(isActive)}
                  onClick={() => setMobileOpen(false)}
                >
                  Allied Commodities
                </NavLink>
              </div>
            </div>

            {[
              { to: '/bulk-charcoal', label: 'Bulk Order' },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
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