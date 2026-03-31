export default function CartSidebar({ items, total, onClose, onUpdateQty, onRemove, onCheckout }) {
  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="cart-sidebar" role="complementary" aria-label="Shopping cart">
        <div className="cart-header">
          <h2 className="cart-title">🛒 Your Cart</h2>
          <button id="close-cart-btn" className="close-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🎮</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: 6 }}>Add some games to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  className="cart-item-img"
                  src={item.cover}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/64x40/111420/7c5cfc?text=🎮`;
                  }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">${(item.finalPrice * item.quantity).toFixed(2)}</div>
                </div>
                <div className="cart-item-qty">
                  <button
                    id={`qty-dec-${item.id}`}
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.id, -1)}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    id={`qty-inc-${item.id}`}
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.id, 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <button
                  id={`remove-item-${item.id}`}
                  className="remove-btn"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.title}`}
                >🗑</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">${total.toFixed(2)}</span>
          </div>
          <button
            id="checkout-btn"
            className="checkout-btn"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Proceed to Checkout →
          </button>
        </div>
      </aside>
    </>
  );
}
