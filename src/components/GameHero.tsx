import type { Game } from '../types';
import { CATEGORY_LABELS } from '../data/games';
import { StatusBadge } from './StatusBadge';
import { DownloadButton } from './DownloadButton';
import { formatDate } from '../utils/format';
import './GameHero.css';

interface GameHeroProps {
  game: Game;
}

export function GameHero({ game }: GameHeroProps) {
  const showPromoBadge = game.codeStatus !== 'expired' && game.codeStatus !== 'none';

  return (
    <div className="game-hero">
      <div className="container game-hero-grid">
        <div className="game-hero-main">
          <div className="game-hero-icon">
            <img src={game.image} alt="" width={84} height={84} />
          </div>
          <div className="game-hero-text">
            <span className="eyebrow">{CATEGORY_LABELS[game.category]}</span>
            <h1>{game.name}</h1>
            <p className="game-hero-summary">{game.summary}</p>
            <div className="game-hero-badges">
              <span className="game-hero-reviewed">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 7.5l3 3 6-6"
                    stroke="var(--positive-fg)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reviewed {formatDate(game.reviewedAt)}
              </span>
              {showPromoBadge && <StatusBadge status={game.codeStatus} />}
            </div>
          </div>
        </div>

        <div className="game-hero-panel">
          <DownloadButton url={game.downloadUrl} gameName={game.name} />
          <a href="#promo-codes" className="btn btn-secondary">
            View Promo Codes
          </a>
        </div>
      </div>
    </div>
  );
}
