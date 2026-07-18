import { Link } from 'react-router-dom';
import type { Game } from '../types';
import { CATEGORY_LABELS } from '../data/games';
import { DownloadButton } from './DownloadButton';
import './GameCard.css';

export function GameCard({ game }: { game: Game }) {
  return (
    <article className="card game-card">
      <div className="game-card-media">
        <img src={game.image} alt="" loading="lazy" width={84} height={84} />
      </div>
      <div className="game-card-body">
        <div className="game-card-top">
          <div>
            <h3>
              <Link to={`/uono-games/${game.slug}`}>{game.name}</Link>
            </h3>
            <span className="game-card-category">{CATEGORY_LABELS[game.category]}</span>
          </div>
        </div>
        <p className="game-card-summary">{game.summary}</p>
        <div className="game-card-foot">
          <Link to={`/uono-games/${game.slug}`} className="btn btn-secondary btn-sm">
            View details
          </Link>
          <DownloadButton url={game.downloadUrl} gameName={game.name} small />
        </div>
      </div>
    </article>
  );
}
