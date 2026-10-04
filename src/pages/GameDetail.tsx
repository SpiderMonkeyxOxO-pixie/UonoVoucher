import { Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GameHero } from '../components/GameHero';
import { QuickInfoGrid, type InfoField } from '../components/QuickInfoGrid';
import { GameSidebar, type PageSection } from '../components/GameSidebar';
import { useMemo } from 'react';
import { PromoCodeGrid } from '../components/PromoCodeCard';
import { applyLive, useLiveOverlay } from '../data/livePromo';
import { FaqAccordion } from '../components/FaqAccordion';
import { RelatedGames } from '../components/RelatedGames';
import { CATEGORY_LABELS } from '../data/games';
import { getGameBySlug, getPromoCodesForGame } from '../data/lookups';
import { getStatusMeta } from '../utils/status';
import { formatDate } from '../utils/format';
import { estimateReadingTime } from '../utils/readingTime';
import './GameDetail.css';

export function GameDetail() {
  const { slug = '' } = useParams();
  const game = getGameBySlug(slug);
  const live = useLiveOverlay();
  const promoCodes = useMemo(
    () => (game ? applyLive(getPromoCodesForGame(game.id), live).filter((p) => p.gameId === game.id) : []),
    [game, live],
  );

  if (!game) return <Navigate to="/uono-games/" replace />;
  const mostRecentChecked = promoCodes.reduce((latest, p) => {
    if (!p.checkedAt) return latest;
    return !latest || p.checkedAt > latest ? p.checkedAt : latest;
  }, '');

  const infoFields: InfoField[] = [
    { label: 'Category', value: CATEGORY_LABELS[game.category] },
    { label: 'Promo-code status', value: getStatusMeta(game.codeStatus).label },
    { label: 'Last checked', value: mostRecentChecked ? formatDate(mostRecentChecked) : '' },
    { label: 'Review status', value: `Reviewed ${formatDate(game.reviewedAt)}` },
  ];

  const sections: PageSection[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'promo-codes', label: 'Promo Codes' },
    { id: 'game-information', label: 'Game Information' },
    { id: 'safety-notice', label: 'Safety Notice' },
    { id: 'faqs', label: 'FAQs' },
  ];

  const readingTime = estimateReadingTime([game.description, game.formatNotes]);

  return (
    <>
      <Seo title={game.metaTitle} description={game.metaDescription} path={`/uono-games/${game.slug}`} />
      <StructuredData
        id={`game-${game.slug}`}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Uono Games', path: '/uono-games/' },
          { name: game.name, path: `/uono-games/${game.slug}` },
        ]}
        faq={game.faqs}
      />

      <div className="container" style={{ paddingTop: 20 }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Uono Games', to: '/uono-games/' }, { label: game.name }]} />
      </div>

      <GameHero game={game} />

      <section className="section">
        <div className="container">
          <QuickInfoGrid fields={infoFields} />

          <div className="game-detail-layout">
            <div className="game-detail-main">
              <div className="game-detail-section" id="overview">
                <h2>About {game.name}</h2>
                <div className="game-detail-meta-row">
                  {game.publishedAt && <span>Published {formatDate(game.publishedAt)}</span>}
                  <span>Last reviewed {formatDate(game.reviewedAt)}</span>
                  <span>{readingTime}</span>
                </div>
                <div className="prose">
                  {game.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="game-detail-section" id="promo-codes">
                <h2>Latest Promo Codes for {game.name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: 16 }}>
                  Tap a release period to see whether a code has been recorded for it yet.
                </p>
                <div className="prose" style={{ marginBottom: 16 }}>
                  {game.promoExplanation.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <PromoCodeGrid codes={promoCodes} />
              </div>

              <div className="game-detail-section" id="game-information">
                <h2>Game Information</h2>
                <div className="prose">
                  {game.formatNotes.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="prose" style={{ marginTop: 8 }}>
                  {game.accessNotes.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="game-detail-section" id="safety-notice">
                <div className="safety-notice-card">
                  <h2>Review and Safety Notice</h2>
                  {game.safetyNotes.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="game-detail-section" id="faqs">
                <h2>Frequently Asked Questions</h2>
                <FaqAccordion items={game.faqs} />
              </div>

              <div className="game-detail-section">
                <h2>Related Games</h2>
                <RelatedGames current={game} />
              </div>
            </div>

            <GameSidebar game={game} promoCheckedAt={mostRecentChecked || undefined} sections={sections} />
          </div>
        </div>
      </section>
    </>
  );
}
