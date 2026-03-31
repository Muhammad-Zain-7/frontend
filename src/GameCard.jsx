import { useState } from 'react';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function GameCard({ game, onAddToCart }) {
  const [justAdded, setJustAdded] = useState(false);

  const finalPrice = game.discount
    ? +(game.price * (1 - game.discount / 100)).toFixed(2)
    : game.price;

  function handleAdd() {
    onAddToCart({ ...game, finalPrice });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <article className="game-card" aria-label={game.title}>
      <div className="card-cover">
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x250/111420/7c5cfc?text=${encodeURIComponent(game.title)}`;
          }}
        />
        {game.discount > 0 && (
          <span className="card-badge">−{game.discount}%</span>
        )}
        <span className="card-genre-badge">{game.genre}</span>
      </div>

      <div className="card-body">
        <h2 className="card-title">{game.title}</h2>
        <p className="card-desc">{game.description}</p>
        <div className="card-rating">
          <StarRating rating={game.rating} />
          <span className="rating-val">{game.rating}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="price-block">
          {game.discount > 0 && (
            <span className="price-original">${game.price.toFixed(2)}</span>
          )}
          <span className={`price-final ${game.discount > 0 ? 'discounted' : ''}`}>
            ${finalPrice.toFixed(2)}
          </span>
        </div>

        <button
          id={`add-to-cart-${game.id}`}
          className={`add-to-cart-btn ${justAdded ? 'added' : ''}`}
          onClick={handleAdd}
          aria-label={`Add ${game.title} to cart`}
        >
          {justAdded ? '✓ Added' : '🛒 Add'}
        </button>
      </div>
    </article>
  );
}
