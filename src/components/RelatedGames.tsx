import { Link } from 'react-router-dom';
import type { Game } from '../types';
import { games, CATEGORY_LABELS } from '../data/games';
import { StatusBadge } from './StatusBadge';
import './RelatedGames.css';

export function RelatedGames({ current }: { current: Game }) {
  const related = games.filter((g) => g.category === current.category && g.id !== current.id).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="related-games-grid">
      {related.map((g) => (
        <Link key={g.id} to={`/uono-games/${g.slug}`} className="related-game-card">
          <img src={g.image} alt="" width={44} height={44} />
          <strong>{g.name}</strong>
          <span className="game-card-category">{CATEGORY_LABELS[g.category]}</span>
          {g.codeStatus !== 'none' && <StatusBadge status={g.codeStatus} />}
        </Link>
      ))}
    </div>
  );
}
