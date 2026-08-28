import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({ title: 'Page Not Found' });
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6" style={{ backgroundColor: 'var(--tcf-bg)' }}>
      <div className="text-center max-w-md">
        <h1 className="font-serif text-7xl md:text-8xl font-bold mb-4" style={{ color: 'var(--tcf-accent)' }}>404</h1>
        <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--tcf-text)' }}>Page Not Found</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide uppercase font-medium transition-all"
            style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide uppercase border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--tcf-secondary-text)', color: 'var(--tcf-secondary-text)' }}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
