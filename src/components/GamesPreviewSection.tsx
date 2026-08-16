import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { games, CATEGORY_LABELS, sortByPin } from '../data/games';
import { categories } from '../data/categories';
import type { GameCategory } from '../types';
import { GameCard } from './GameCard';
import { SearchBar } from './SearchBar';

const PREVIEW_COUNT = 8;

export function GamesPreviewSection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GameCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesCategory = category === 'all' || g.category === category;
      const matchesQuery = g.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const showFeatured = category === 'all' && query.trim() === '';
  const preview = showFeatured
    ? sortByPin(games.filter((g) => g.sortOrder !== undefined || g.featured)).slice(0, PREVIEW_COUNT)
    : filtered.slice(0, PREVIEW_COUNT);

  return (
    <section className="section" id="games">
      <div className="container">
        <div className="section-head-row">
          <div className="section-heading">
            <span className="eyebrow">Uono games we track</span>
            <h2>Our documented Uono games</h2>
            <p>Browse a structured selection from the {games.length} games currently tracked by UonoVoucher.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="filter-row">
          <div className="filter-chips">
            <button
              type="button"
              className={`filter-chip ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`filter-chip ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {CATEGORY_LABELS[c.id]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/blog/uono-games-guide/" className="btn btn-ghost btn-sm">
              Uono games guide
            </Link>
            <Link to="/uono-games/" className="btn btn-ghost btn-sm">
              View all {games.length} games →
            </Link>
          </div>
        </div>

        {preview.length > 0 ? (
          <div className="games-grid">
            {preview.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <p>No games match “{query}”. Try a different search term or category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
