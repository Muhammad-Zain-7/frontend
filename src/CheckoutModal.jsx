import { useState } from 'react';
import { api } from './api.js';

export default function CheckoutModal({ items, total, onClose, onSuccess }) {
  const [form, setForm] = useState({ customerName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ gameId: i.id, quantity: i.quantity }));
      const result = await api.placeOrder({ ...form, items: orderItems });
      setOrder(result);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        {order ? (
          <div className="order-success">
            <div className="success-icon">🎉</div>
            <h2 id="checkout-title">Order Placed!</h2>
            <p>Thanks, <strong>{order.customerName}</strong>! Your receipt is on its way to</p>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.email}</p>
            <div className="order-id">{order.id}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total charged: <strong style={{ color: 'var(--success)' }}>${order.total.toFixed(2)}</strong>
            </p>
            <div className="modal-actions">
              <button id="close-success-btn" className="btn-primary" onClick={onClose}>
                Continue Shopping 🎮
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="checkout-title">Checkout</h2>
            <p className="modal-sub">
              {items.length} item{items.length !== 1 ? 's' : ''} · Total:{' '}
              <strong style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</strong>
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="customerName">Full Name</label>
              <input
                id="customerName"
                name="customerName"
                className="form-input"
                type="text"
                placeholder="Jane Doe"
                value={form.customerName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                className="form-input"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.87rem', marginBottom: 12 }}>
                ⚠️ {error}
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                id="cancel-checkout-btn"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="place-order-btn"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Placing order…' : 'Place Order 🚀'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
