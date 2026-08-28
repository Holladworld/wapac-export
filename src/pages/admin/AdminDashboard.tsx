import { useEffect, useState } from 'react';
import { Package, ShoppingCart, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { adminApi } from '../../lib/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, posts: 0 });
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; company_name: string; status: string; created_at: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, ordRes, msgRes, postRes, ordersRes] = await Promise.all([
          adminApi.select('products', { columns: 'id', limit: 1000 }),
          adminApi.select('orders', { columns: 'id', limit: 1000 }),
          adminApi.select('contact_submissions', { columns: 'id', limit: 1000 }),
          adminApi.select('blog_posts', { columns: 'id', limit: 1000 }),
          adminApi.select('orders', { columns: 'id, company_name, status, created_at', orderBy: 'created_at', ascending: false, limit: 5 }),
        ]);
        setStats({
          products: prodRes.data?.length || 0,
          orders: ordRes.data?.length || 0,
          messages: msgRes.data?.length || 0,
          posts: postRes.data?.length || 0,
        });
        setRecentOrders(ordersRes.data || []);
      } catch { /* handled by auth redirect */ }
    })();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: Package },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Messages', value: stats.messages, icon: MessageSquare },
    { label: 'Blog Posts', value: stats.posts, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Overview of your export business.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <card.icon size={20} style={{ color: 'var(--tcf-accent)' }} />
              <TrendingUp size={14} style={{ color: 'var(--tcf-secondary-text)' }} />
            </div>
            <div className="font-serif text-3xl font-bold" style={{ color: 'var(--tcf-text)' }}>{card.value}</div>
            <div className="text-xs tracking-wide uppercase mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>{card.label}</div>
          </div>
        ))}
      </div>
      <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
        <h3 className="font-serif text-lg font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between text-sm pb-3 border-b" style={{ borderColor: 'var(--tcf-border)' }}>
                <span style={{ color: 'var(--tcf-text)' }}>{order.company_name}</span>
                <span className="text-xs px-2 py-0.5" style={{ color: 'var(--tcf-accent)', border: '1px solid var(--tcf-border)' }}>{order.status}</span>
                <span className="text-xs" style={{ color: 'var(--tcf-secondary-text)' }}>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
