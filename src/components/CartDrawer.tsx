import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBrowseProducts = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Inquiry Cart"
        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col animate-slide-up"
        style={{ backgroundColor: 'var(--tcf-bg)', borderLeft: '1px solid var(--tcf-border)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--tcf-border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: 'var(--tcf-accent)' }} />
            <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--tcf-text)' }}>
              Inquiry Cart ({totalItems})
            </h2>
          </div>
          <button onClick={closeCart} aria-label="Close cart" style={{ color: 'var(--tcf-secondary-text)' }} className="hover:opacity-80 transition-opacity">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} className="mb-4" style={{ color: 'var(--tcf-secondary-text)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--tcf-text)' }}>Your inquiry cart is empty</p>
            <p className="text-sm mb-6" style={{ color: 'var(--tcf-secondary-text)' }}>
              Add products to your inquiry cart to request a bulk quote.
            </p>
            <button
              onClick={handleBrowseProducts}
              className="px-6 py-3 text-sm tracking-wide uppercase font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4 pb-4 border-b" style={{ borderColor: 'var(--tcf-border)' }}>
                  <div className="w-20 h-20 shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--tcf-card)' }}>
                    {item.image_url && (
                      <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`} onClick={closeCart}
                      className="font-medium text-sm block mb-1 truncate transition-colors hover:opacity-80"
                      style={{ color: 'var(--tcf-text)' }}>
                      {item.product_name}
                    </Link>
                    <p className="text-xs mb-2" style={{ color: 'var(--tcf-secondary-text)' }}>
                      ${Number(item.price_at_purchase).toFixed(0)} / {item.unit_name}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border" style={{ borderColor: 'var(--tcf-border)' }}>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          aria-label="Decrease quantity" className="p-1.5 transition-colors hover:opacity-80"
                          style={{ color: 'var(--tcf-secondary-text)' }}>
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-sm" style={{ color: 'var(--tcf-text)' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          aria-label="Increase quantity" className="p-1.5 transition-colors hover:opacity-80"
                          style={{ color: 'var(--tcf-secondary-text)' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product_id)}
                        aria-label="Remove item" className="transition-colors hover:opacity-80"
                        style={{ color: '#dc2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t" style={{ borderColor: 'var(--tcf-border)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Estimated Total</span>
                <span className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>
                  ${totalPrice.toFixed(0)}
                </span>
              </div>
              <Link to="/checkout" onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg mb-2"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
                Request Quote <ArrowRight size={16} />
              </Link>
              <button onClick={clearCart}
                className="w-full py-2 text-xs tracking-wide uppercase transition-colors hover:opacity-80"
                style={{ color: 'var(--tcf-secondary-text)' }}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
