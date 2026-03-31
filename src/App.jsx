import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';
import { useCart } from './useCart.js';
import GameCard from './GameCard.jsx';
import CartSidebar from './CartSidebar.jsx';
import CheckoutModal from './CheckoutModal.jsx';
import Toast from './Toast.jsx';

const GENRES = ['All', 'RPG', 'MMO', 'Racing', 'Strategy', 'Horror', 'Action'];

export default function App() {
  const [games, setGames]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState('');
  const [search, setSearch]         = useState('');
  const [genre, setGenre]           = useState('All');
  const [cartOpen, setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast]           = useState(null);

  const { items, addItem, removeItem, updateQty, clearCart, total, count } = useCart();

  // Fetch games on mount
  useEffect(() => {
    api.getGames()
      .then((data) => setGames(data.games))
      .catch((e) => setApiError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtered view
  const filtered = games.filter((g) => {
    const matchGenre = genre === 'All' || g.genre === genre;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    return matchGenre && matchSearch;
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  function handleAddToCart(game) {
    addItem(game);
    showToast(`${game.title} added to cart!`);
  }

  function handleCheckoutSuccess() {
    clearCart();
    setCartOpen(false);
  }

  function handleCloseCheckout() {
    setCheckoutOpen(false);
  }

  const appName = import.meta.env.VITE_APP_NAME || 'GameStore';

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">{appName}</span>
          </div>

          <div className="nav-search">
            <span className="search-icon">🔍</span>
            <input
              id="search-input"
              type="search"
              placeholder="Search games…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search games"
            />
          </div>

          <div className="nav-actions">
            <button
              id="open-cart-btn"
              className="cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
            >
              🛒 Cart
              {count > 0 && <span className="cart-badge" aria-hidden="true">{count}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="hero">
        <div className="container">
          <h1>Level Up Your Library</h1>
          <p>Discover top-rated games across every genre — from epic RPGs to blazing racers.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{games.length}+</div>
              <div className="hero-stat-label">Games</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">50%</div>
              <div className="hero-stat-label">Max Discount</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">4.8★</div>
              <div className="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main>
        <div className="container">
          {/* Genre filters */}
          <div className="filters" role="group" aria-label="Filter by genre">
            <span className="filter-label">Genre:</span>
            {GENRES.map((g) => (
              <button
                key={g}
                id={`filter-${g.toLowerCase()}`}
                className={`filter-chip ${genre === g ? 'active' : ''}`}
                onClick={() => setGenre(g)}
                aria-pressed={genre === g}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Section header */}
          <div className="section-header">
            <h2 className="section-title">
              {genre === 'All' ? 'All Games' : genre}
            </h2>
            <span className="section-count">
              {loading ? 'Loading…' : `${filtered.length} title${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* States */}
          {loading && (
            <div className="loader">
              <div className="spinner" role="status" aria-label="Loading games" />
              <p>Loading games…</p>
            </div>
          )}

          {!loading && apiError && (
            <div className="error-state">
              <h2>⚡ Couldn't connect to the API</h2>
              <p>{apiError}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Make sure the backend is running on <code>localhost:5000</code>
              </p>
              <button
                id="retry-btn"
                className="btn-primary"
                style={{ display: 'inline-block', marginTop: 12, padding: '12px 28px' }}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !apiError && filtered.length === 0 && (
            <div className="error-state">
              <h2 style={{ color: 'var(--text-secondary)' }}>No games found</h2>
              <p>Try a different search term or genre filter.</p>
            </div>
          )}

          {!loading && !apiError && filtered.length > 0 && (
            <div className="games-grid">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} <span>{appName}</span> — Built for Kubernetes practice 🚀</p>
        </div>
      </footer>

      {/* ── Cart Sidebar ── */}
      {cartOpen && (
        <CartSidebar
          items={items}
          total={total}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {/* ── Checkout Modal ── */}
      {checkoutOpen && (
        <CheckoutModal
          items={items}
          total={total}
          onClose={handleCloseCheckout}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
