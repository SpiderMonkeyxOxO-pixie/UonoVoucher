import { Link } from 'react-router-dom';
import { promoCodes } from '../data/promoCodes';
import { PromoCodeGrid } from './PromoCodeCard';

export function PromoCodeSection() {
  const preview = promoCodes.slice(0, 6);

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <div className="section-head-row">
          <div className="section-heading">
            <span className="eyebrow">Daily promo-code tracker</span>
            <h2>Codes by platform, updated through the day</h2>
            <p>
              Morning, afternoon and evening releases — tap a time slot to check what&apos;s live,
              then copy the code.
            </p>
          </div>
          <Link to="/promo-codes/" className="btn btn-secondary btn-sm">
            View all promo codes →
          </Link>
        </div>
        <PromoCodeGrid codes={preview} />
      </div>
    </section>
  );
}
