import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PromoCodeGrid } from '../components/PromoCodeCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { promoCodes } from '../data/promoCodes';
import { games } from '../data/games';
import { categories } from '../data/categories';
import { getGameById } from '../data/lookups';
import { getStatusMeta, isDisabledStatus } from '../utils/status';
import { formatDate } from '../utils/format';
import type { GameCategory, TimeSlot } from '../types';
import './PromoCodesList.css';

const STATUS_OPTIONS = ['checked', 'reported', 'unconfirmed', 'expired', 'withdrawn'] as const;
const PERIOD_OPTIONS: { id: TimeSlot; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
];
const SORT_OPTIONS = [
  { id: 'az', label: 'A–Z' },
  { id: 'recent', label: 'Recently checked' },
  { id: 'available', label: 'Available first' },
] as const;

const FAQ_ITEMS = [
  {
    question: 'How often are promo codes reviewed?',
    answer:
      'Codes are reviewed on a recurring schedule rather than only when first added — see our Code Review Policy for the full process and cadence.',
  },
  {
    question: 'What does "Awaiting release" mean?',
    answer:
      'It means no code has been recorded for that particular release period (morning, afternoon or evening) yet — not that one is guaranteed to arrive.',
  },
  {
    question: 'Are promo codes active for the whole day?',
    answer:
      'Not necessarily. Some are tied to a specific release window, which is why we track morning, afternoon and evening separately rather than as one status per game.',
  },
  {
    question: 'Why is a code marked unconfirmed?',
    answer:
      'It means we could not verify the code either way during our last review — not that it is confirmed working or confirmed broken.',
  },
  {
    question: 'Where does the download button lead?',
    answer:
      'It opens the listed game\'s own external page in a new tab. UonoVoucher does not host or serve any installer file itself.',
  },
  {
    question: 'How can outdated information be reported?',
    answer: 'Use our Contact page to flag anything that looks wrong — see our Corrections Policy for what happens next.',
  },
];

export function PromoCodesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as GameCategory | null;
  const category = categoryParam && categories.some((c) => c.id === categoryParam) ? categoryParam : 'all';

  const [status, setStatus] = useState<string>('all');
  const [period, setPeriod] = useState<string>('all');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['id']>('az');
  const [query, setQuery] = useState('');

  function setCategory(next: GameCategory | 'all') {
    if (next === 'all') searchParams.delete('category');
    else searchParams.set('category', next);
    setSearchParams(searchParams, { replace: true });
  }

  const stats = useMemo(() => {
    const codesAvailable = promoCodes.filter((p) => !isDisabledStatus(p.status)).length;
    const awaitingRelease = games.filter((g) => g.codeStatus === 'none').length;
    const lastReviewed = promoCodes.reduce((latest, p) => {
      if (!p.checkedAt) return latest;
      return !latest || p.checkedAt > latest ? p.checkedAt : latest;
    }, '');
    return { gamesTracked: games.length, codesAvailable, awaitingRelease, lastReviewed };
  }, []);

  const filtered = useMemo(() => {
    let list = promoCodes.filter((code) => {
      const game = getGameById(code.gameId);
      const matchesStatus = status === 'all' || code.status === status;
      const matchesPeriod = period === 'all' || (code.timeSlot ?? 'morning') === period;
      const matchesCategory = category === 'all' || game?.category === category;
      const matchesQuery = !query || (game?.name.toLowerCase().includes(query.toLowerCase()) ?? false);
      return matchesStatus && matchesPeriod && matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'recent') return (b.checkedAt ?? '').localeCompare(a.checkedAt ?? '');
      if (sort === 'available') {
        const aDisabled = isDisabledStatus(a.status);
        const bDisabled = isDisabledStatus(b.status);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
      }
      const nameA = getGameById(a.gameId)?.name ?? '';
      const nameB = getGameById(b.gameId)?.name ?? '';
      return nameA.localeCompare(nameB);
    });

    return list;
  }, [status, period, category, query, sort]);

  const hasActiveFilters = status !== 'all' || period !== 'all' || category !== 'all' || query !== '';

  function clearFilters() {
    setStatus('all');
    setPeriod('all');
    setQuery('');
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  }

  return (
    <>
      <Seo
        title="Latest Uono & Uono Play Promo Codes"
        description="Browse promo-code updates for every documented Uono Play game, tracked by morning, afternoon and evening release with clear status and review dates."
        path="/promo-codes/"
      />
      <StructuredData
        id="promo-codes-page"
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Promo Codes', path: '/promo-codes/' },
        ]}
        faq={FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Promo Codes' }]} />
          <span className="eyebrow">Promo code tracker</span>
          <h1>Latest Uono Game Promo Codes</h1>
          <p>
            Codes are recorded by game and release period — morning, afternoon and evening — and
            re-checked on a recurring schedule. Nothing here is guaranteed to be currently active;
            check the status and date on each card before relying on it.
          </p>
          <div className="hero-actions">
            <a href="#directory" className="btn btn-primary">
              Browse Promo Codes
            </a>
            <Link to="/uono-games/" className="btn btn-secondary">
              View All Games
            </Link>
          </div>
          <div className="promo-hero-stats">
            <span>
              <strong>{stats.gamesTracked}</strong> games listed
            </span>
            <span>
              <strong>{stats.codesAvailable}</strong> code entries available
            </span>
            <span>
              <strong>{stats.awaitingRelease}</strong> awaiting an update
            </span>
            {stats.lastReviewed && (
              <span>
                Last page update <strong>{formatDate(stats.lastReviewed)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="section" id="directory">
        <div className="container">
          <div className="promo-stat-row">
            <div className="promo-stat-card">
              <span className="promo-stat-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="3" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <div>
                <strong>{stats.gamesTracked}</strong>
                <span>Games tracked</span>
              </div>
            </div>
            <div className="promo-stat-card">
              <span className="promo-stat-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9.5l3.5 3.5L14 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <strong>{stats.codesAvailable}</strong>
                <span>Codes available</span>
              </div>
            </div>
            <div className="promo-stat-card">
              <span className="promo-stat-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 5.5V9l2.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <strong>{stats.awaitingRelease}</strong>
                <span>Awaiting release</span>
              </div>
            </div>
            <div className="promo-stat-card">
              <span className="promo-stat-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9h12M9 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <strong>{stats.lastReviewed ? formatDate(stats.lastReviewed) : '—'}</strong>
                <span>Last reviewed</span>
              </div>
            </div>
          </div>

          <div className="promo-quick-nav" aria-label="Jump to category">
            {categories.map((c) => (
              <a
                key={c.id}
                href="#directory"
                onClick={(e) => {
                  e.preventDefault();
                  setCategory(category === c.id ? 'all' : c.id);
                }}
                style={category === c.id ? { borderColor: 'var(--violet-2)', color: 'var(--violet)' } : undefined}
              >
                {c.label}
              </a>
            ))}
          </div>

          <div className="promo-filter-bar">
            <div className="promo-filter-row">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by game name"
                aria-label="Search by game name"
                className="promo-select"
                style={{ minWidth: 200, flex: 1 }}
              />
              <select
                className="promo-select"
                aria-label="Filter by category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GameCategory | 'all')}
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select className="promo-select" aria-label="Filter by availability" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {getStatusMeta(s).label}
                  </option>
                ))}
              </select>
              <select className="promo-select" aria-label="Filter by release period" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="all">All periods</option>
                {PERIOD_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <select
                className="promo-select"
                aria-label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORT_OPTIONS)[number]['id'])}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="promo-result-row">
            <span>
              Showing {filtered.length} of {promoCodes.length} promo-code entries
            </span>
            {hasActiveFilters && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          <PromoCodeGrid codes={filtered} />

          <div className="editorial-notice-card">
            <h2>Before Using a Promo Code</h2>
            <ul>
              <li>Codes can change by time, app version, account, or platform without notice.</li>
              <li>A listed code is not guaranteed to remain active — check its status and date first.</li>
              <li>External download links are operated by third parties, not by UonoVoucher.</li>
              <li>UonoVoucher never requests passwords, OTPs, payment details, or private screenshots.</li>
              <li>When in doubt, treat a code as unconfirmed until proven otherwise.</li>
            </ul>
          </div>

          <div className="related-links-grid">
            <Link to="/uono-games/" className="related-link-card">
              All Uono Games
            </Link>
            <Link to="/vouchers/" className="related-link-card">
              Vouchers
            </Link>
            <Link to="/guides/" className="related-link-card">
              Guides
            </Link>
            <Link to="/editorial-policy/" className="related-link-card">
              Editorial Policy
            </Link>
          </div>

          <div className="section-heading" style={{ marginTop: 48 }}>
            <h2>Frequently asked questions</h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
