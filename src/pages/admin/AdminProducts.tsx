import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { type Product } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('products', { orderBy: 'created_at', ascending: false });
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await adminApi.delete('products', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage your product catalog.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && <ProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
              <div className="aspect-square mb-3 overflow-hidden" style={{ backgroundColor: 'var(--tcf-bg)' }}>
                {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
              </div>
              <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--tcf-text)' }}>{product.name}</h3>
              <p className="text-xs mb-3" style={{ color: 'var(--tcf-secondary-text)' }}>{product.category} · ${product.bulk_price_per_unit}/{product.bulk_unit_name}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(product); setShowForm(true); }} className="flex items-center gap-1 px-3 py-1.5 text-xs border" style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' }}>
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs" style={{ color: '#dc2626' }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || '', description: product?.description || '', grade: product?.grade || '',
    category: product?.category || '', image_url: product?.image_url || '',
    bulk_price_per_unit: product?.bulk_price_per_unit?.toString() || '0', bulk_min_qty: product?.bulk_min_qty?.toString() || '1',
    bulk_unit_name: product?.bulk_unit_name || 'ton', branded_price_per_unit: product?.branded_price_per_unit?.toString() || '0',
    branded_min_qty: product?.branded_min_qty?.toString() || '1', branded_unit_name: product?.branded_unit_name || 'box',
    service_type: product?.service_type || 'charcoal',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      bulk_price_per_unit: Number(form.bulk_price_per_unit) || 0,
      bulk_min_qty: Number(form.bulk_min_qty) || 1,
      branded_price_per_unit: Number(form.branded_price_per_unit) || 0,
      branded_min_qty: Number(form.branded_min_qty) || 1,
      specifications: product?.specifications || {},
      price_per_ton: Number(form.bulk_price_per_unit) || 0,
    };
    if (product) {
      await adminApi.update('products', product.id, payload);
    } else {
      await adminApi.insert('products', payload);
    }
    setSaving(false);
    onSaved();
  };

  const inputClass = "w-full px-3 py-2 text-sm border outline-none";
  const inputStyle = { backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--tcf-bg)', border: '1px solid var(--tcf-border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} style={{ color: 'var(--tcf-secondary-text)' }}><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <input className={inputClass} style={inputStyle} placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className={inputClass} style={inputStyle} placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <input className={inputClass} style={inputStyle} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className={inputClass} style={inputStyle} placeholder="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            <select className={inputClass} style={inputStyle} value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}>
              <option value="charcoal">Charcoal</option>
              <option value="allied">Allied</option>
            </select>
          </div>
          <input className={inputClass} style={inputStyle} placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" className={inputClass} style={inputStyle} placeholder="Bulk Price" value={form.bulk_price_per_unit} onChange={(e) => setForm({ ...form, bulk_price_per_unit: e.target.value })} />
            <input type="number" className={inputClass} style={inputStyle} placeholder="Min Qty" value={form.bulk_min_qty} onChange={(e) => setForm({ ...form, bulk_min_qty: e.target.value })} />
            <input className={inputClass} style={inputStyle} placeholder="Unit Name" value={form.bulk_unit_name} onChange={(e) => setForm({ ...form, bulk_unit_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" className={inputClass} style={inputStyle} placeholder="Branded Price" value={form.branded_price_per_unit} onChange={(e) => setForm({ ...form, branded_price_per_unit: e.target.value })} />
            <input type="number" className={inputClass} style={inputStyle} placeholder="Min Qty" value={form.branded_min_qty} onChange={(e) => setForm({ ...form, branded_min_qty: e.target.value })} />
            <input className={inputClass} style={inputStyle} placeholder="Unit Name" value={form.branded_unit_name} onChange={(e) => setForm({ ...form, branded_unit_name: e.target.value })} />
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
