import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Game } from '../types';
import { DownloadButton } from './DownloadButton';
import { getStatusMeta } from '../utils/status';
import { formatDate } from '../utils/format';
import './GameSidebar.css';

export interface PageSection {
  id: string;
  label: string;
}

interface GameSidebarProps {
  game: Game;
  promoCheckedAt?: string;
  sections: PageSection[];
}

export function GameSidebar({ game, promoCheckedAt, sections }: GameSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="game-sidebar" aria-label="Game page navigation and quick actions">
      <div className="sidebar-card">
        <h3>Quick actions</h3>
        <div className="sidebar-actions">
          <DownloadButton url={game.downloadUrl} gameName={game.name} />
          <a href="#promo-codes" className="btn btn-secondary btn-sm">
            View promo codes
          </a>
          <Link to="/blog/uono-games-guide/" className="btn btn-ghost btn-sm">
            Uono games guide
          </Link>
          <Link to="/contact/" className="btn btn-ghost btn-sm">
            Report outdated information
          </Link>
        </div>
      </div>

      <div className="sidebar-card">
        <h3>Status</h3>
        <div className="sidebar-status-list">
          <div className="sidebar-status-row">
            <span>Promo-code status</span>
            <span>{getStatusMeta(game.codeStatus).label}</span>
          </div>
          {promoCheckedAt && (
            <div className="sidebar-status-row">
              <span>Last checked</span>
              <span>{formatDate(promoCheckedAt)}</span>
            </div>
          )}
          <div className="sidebar-status-row">
            <span>Last reviewed</span>
            <span>{formatDate(game.reviewedAt)}</span>
          </div>
        </div>
      </div>

      {sections.length > 0 && (
        <div className="sidebar-card">
          <h3>On this page</h3>
          <nav className="sidebar-nav">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={activeId === s.id ? 'active' : ''}>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
