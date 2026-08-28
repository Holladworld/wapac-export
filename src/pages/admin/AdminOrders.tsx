import { useEffect, useState, useCallback } from 'react';
import { Loader2, Eye } from 'lucide-react';
import { type Order } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('orders', { orderBy: 'created_at', ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b', Confirmed: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#16a34a', Cancelled: '#dc2626',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Orders</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage quote requests and orders.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : orders.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="p-5 flex items-center justify-between" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div>
                <h3 className="font-medium text-sm" style={{ color: 'var(--tcf-text)' }}>{order.company_name}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>{order.contact_name} · {order.contact_email}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>{order.total_tons} tons · ${order.total_price} · {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1" style={{ color: statusColors[order.status] || 'var(--tcf-secondary-text)', border: `1px solid ${statusColors[order.status] || 'var(--tcf-border)'}` }}>{order.status}</span>
                <button onClick={() => setSelected(order)} className="p-2" style={{ color: 'var(--tcf-accent)' }}><Eye size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg p-8" style={{ backgroundColor: 'var(--tcf-bg)', border: '1px solid var(--tcf-border)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>Order Details</h2>
            <div className="space-y-2 text-sm">
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Company:</strong> {selected.company_name}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Contact:</strong> {selected.contact_name}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Email:</strong> {selected.contact_email}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>VAT:</strong> {selected.vat_number || 'N/A'}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Address:</strong> {selected.shipping_address}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Payment:</strong> {selected.payment_method}</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Total:</strong> ${selected.total_price} ({selected.total_tons} tons)</p>
              <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Status:</strong> {selected.status}</p>
              {selected.tracking_number && <p style={{ color: 'var(--tcf-secondary-text)' }}><strong style={{ color: 'var(--tcf-text)' }}>Tracking:</strong> {selected.tracking_number}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
