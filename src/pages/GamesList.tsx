import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GameCard } from '../components/GameCard';
import { SearchBar } from '../components/SearchBar';
import { games, CATEGORY_LABELS, sortByPin } from '../data/games';
import { categories } from '../data/categories';
import type { GameCategory } from '../types';

export function GamesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as GameCategory | null;
  const [query, setQuery] = useState('');

  const category = categoryParam && categories.some((c) => c.id === categoryParam) ? categoryParam : 'all';

  const filtered = useMemo(() => {
    const matches = games.filter((g) => {
      const matchesCategory = category === 'all' || g.category === category;
      const matchesQuery = g.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
    return sortByPin(matches);
  }, [query, category]);

  function setCategory(next: GameCategory | 'all') {
    if (next === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', next);
    }
    setSearchParams(searchParams, { replace: true });
  }

  return (
    <>
      <Seo
        title="All Uono Games"
        description={`Browse all ${games.length} documented Uono Play games tracked by UonoVoucher, with category filters and search.`}
        path="/uono-games/"
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Uono Games' }]} />
          <h1>All documented Uono games</h1>
          <p>
            A structured, searchable list of the {games.length} games UonoVoucher currently tracks, including
            category, review dates, and promo-code status. Read our{' '}
            <Link to="/blog/uono-games-guide/" style={{ color: 'var(--violet)', textDecoration: 'underline' }}>
              Uono games guide
            </Link>{' '}
            to learn about game categories.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
              Showing {filtered.length} of {games.length} games
            </p>
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
          </div>

          {filtered.length > 0 ? (
            <div className="games-grid">
              {filtered.map((game) => (
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
    </>
  );
}
