import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { StatusBadge } from '../components/StatusBadge';
import { CopyButton } from '../components/CopyButton';
import { getGameById, getPromoCodeById } from '../data/lookups';
import { formatDate } from '../utils/format';
import { isDisabledStatus } from '../utils/status';

export function PromoCodeDetail() {
  const { slug = '' } = useParams();
  const promo = getPromoCodeById(slug);

  if (!promo) return <Navigate to="/promo-codes/" replace />;

  const game = getGameById(promo.gameId);
  const disabled = isDisabledStatus(promo.status);

  return (
    <>
      <Seo
        title={`${game?.name ?? 'Promo code'} — ${promo.code}`}
        description={`Status, review history and source note for the ${promo.code} promo code${game ? ` linked to ${game.name}` : ''}.`}
        path={`/promo-codes/${promo.id}`}
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Promo Codes', to: '/promo-codes/' },
              { label: promo.code },
            ]}
          />
          <h1>{promo.code}</h1>
          {game && (
            <p>
              Linked to{' '}
              <Link to={`/uono-games/${game.slug}`} style={{ color: 'var(--violet)', fontWeight: 600 }}>
                {game.name}
              </Link>
            </p>
          )}
          <div style={{ marginTop: 14 }}>
            <StatusBadge status={promo.status} />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 28, maxWidth: 640 }}>
            <div className="voucher-code-row" style={{ marginBottom: 20 }}>
              <span className="voucher-code-chip">{promo.code}</span>
              <CopyButton code={promo.code} disabled={disabled} />
            </div>
            <div className="voucher-meta-list">
              <span>
                <strong>Added:</strong> {formatDate(promo.addedAt)}
              </span>
              {promo.checkedAt && (
                <span>
                  <strong>Last checked:</strong> {formatDate(promo.checkedAt)}
                </span>
              )}
              {promo.expiresAt && (
                <span>
                  <strong>Expires:</strong> {formatDate(promo.expiresAt)}
                </span>
              )}
              {promo.eligibility && (
                <span>
                  <strong>Eligibility:</strong> {promo.eligibility}
                </span>
              )}
            </div>
            {promo.sourceNote && (
              <p className="voucher-source-note" style={{ marginTop: 16 }}>
                Source note: {promo.sourceNote}
              </p>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 20 }}>
            Codes are compiled from community reports and periodic manual review. See our{' '}
            <Link to="/code-review-policy/">Code Review Policy</Link> for how records are checked.
          </p>
        </div>
      </section>
    </>
  );
}
