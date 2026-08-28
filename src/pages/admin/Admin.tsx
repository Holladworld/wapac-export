import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, FileText, Mail, Plug,
  Settings, LogOut, Menu, X, Image, MessageSquare,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminBlog from './AdminBlog';
import AdminEmail from './AdminEmail';
import AdminIntegrations from './AdminIntegrations';
import AdminSettings from './AdminSettings';
import AdminMedia from './AdminMedia';
import AdminMessages from './AdminMessages';
import AdminSlider from './AdminSlider';

export default function Admin() {
  const { isAuthenticated, user, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'blog', label: 'Blog Posts', icon: FileText },
    { key: 'slider', label: 'Slider', icon: Image },
    { key: 'media', label: 'Media Library', icon: Image },
    { key: 'email', label: 'Email Templates', icon: Mail },
    { key: 'integrations', label: 'Integrations', icon: Plug },
    { key: 'settings', label: 'Site Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'messages': return <AdminMessages />;
      case 'blog': return <AdminBlog />;
      case 'slider': return <AdminSlider />;
      case 'media': return <AdminMedia />;
      case 'email': return <AdminEmail />;
      case 'integrations': return <AdminIntegrations />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--tcf-bg)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: 'var(--tcf-primary)', borderRight: '1px solid var(--tcf-border)' }}
      >
        <div className="p-6">
          <h2 className="font-serif text-lg font-bold" style={{ color: 'var(--tcf-text)' }}>Wapac Admin</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>{user?.display_name}</p>
        </div>
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors"
              style={{
                color: activeTab === item.key ? 'var(--tcf-accent)' : 'var(--tcf-secondary-text)',
                backgroundColor: activeTab === item.key ? 'rgba(245,158,11,0.1)' : 'transparent',
              }}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 mt-4">
          <button
            onClick={() => { logout(); navigate('/admin'); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors hover:opacity-80"
            style={{ color: '#dc2626' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 overflow-x-hidden">
        <header
          className="lg:hidden flex items-center justify-between p-4 border-b"
          style={{ backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)' }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--tcf-text)' }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-serif font-bold" style={{ color: 'var(--tcf-text)' }}>Admin Panel</span>
          <div />
        </header>
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
