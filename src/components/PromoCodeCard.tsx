import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PromoCode, TimeSlot } from '../types';
import { getGameById } from '../data/lookups';
import { CATEGORY_LABELS } from '../data/games';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { StatusBadge } from './StatusBadge';
import { isDisabledStatus, getStatusMeta } from '../utils/status';
import { formatDate } from '../utils/format';
import './PromoCodeCard.css';

const SLOTS: { id: TimeSlot; label: string }[] = [
  { id: 'morning', label: 'AM' },
  { id: 'afternoon', label: 'PM' },
  { id: 'evening', label: 'Eve' },
];

const SLOT_NAME: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export function PromoCodeCard({ entry }: { entry: PromoCode }) {
  const game = getGameById(entry.gameId);
  const codeSlot = entry.timeSlot ?? 'morning';
  const [activeSlot, setActiveSlot] = useState<TimeSlot>(codeSlot);

  if (!game) return null;

  const showingCode = activeSlot === codeSlot;
  const disabled = isDisabledStatus(entry.status);
  const statusMeta = getStatusMeta(entry.status);

  return (
    <article className="promo-card">
      <div className="promo-card-head">
        <img src={game.image} alt="" width={34} height={34} />
        <div className="promo-card-head-text">
          <Link to={`/uono-games/${game.slug}`}>{game.name}</Link>
          <span className="promo-card-category">{CATEGORY_LABELS[game.category]}</span>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <div className="promo-tabs" role="tablist" aria-label={`Daily release times for ${game.name}`}>
        {SLOTS.map((slot) => (
          <button
            key={slot.id}
            type="button"
            role="tab"
            aria-selected={activeSlot === slot.id}
            className={`promo-tab ${activeSlot === slot.id ? 'active' : ''} ${slot.id === codeSlot ? 'has-code' : ''}`}
            onClick={() => setActiveSlot(slot.id)}
          >
            {slot.label}
          </button>
        ))}
      </div>

      <div className="promo-slot">
        <span className="promo-slot-label">{SLOT_NAME[activeSlot]}</span>
        {showingCode ? (
          disabled ? (
            <span className="promo-awaiting" style={{ color: 'var(--negative-fg)' }}>
              {statusMeta.label}
            </span>
          ) : (
            <div className="promo-code-row">
              <code>{entry.code}</code>
              <CopyButton code={entry.code} />
            </div>
          )
        ) : (
          <span className="promo-awaiting">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5.2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6.5 3.6V6.5l2 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Awaiting release
          </span>
        )}
      </div>

      {entry.checkedAt && <span className="promo-checked">Checked {formatDate(entry.checkedAt)}</span>}

      <div className="promo-card-foot">
        <Link to={`/uono-games/${game.slug}`} className="btn btn-secondary btn-sm">
          View Game
        </Link>
        <DownloadButton url={game.downloadUrl} gameName={game.name} small />
      </div>
    </article>
  );
}

export function PromoCodeGrid({ codes }: { codes: PromoCode[] }) {
  if (codes.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No promo-code update is recorded for this release period.</p>
      </div>
    );
  }
  return (
    <div className="promo-grid">
      {codes.map((entry) => (
        <PromoCodeCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
