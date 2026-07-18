import { Link } from 'react-router-dom';
import { games } from '../data/games';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-copy">
          <span className="hero-notice">
            <span className="dot" aria-hidden="true" />
            Independent information portal
          </span>
          <h1>Uono &amp; Uono Play promo codes, vouchers and game updates</h1>
          <p>
            Browse independent information for Uono Play and {games.length} documented Uono games,
            manually reviewed promo-code records, special vouchers, and practical guides.
          </p>
          <div className="hero-actions">
            <Link to="/uono-games/" className="btn btn-primary">
              Explore Uono Games
            </Link>
            <Link to="/vouchers/" className="btn btn-secondary">
              View Latest Vouchers
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{games.length}</strong>
              <span>Documented games</span>
            </div>
            <div className="hero-stat">
              <strong>Manual</strong>
              <span>Reviewed records</span>
            </div>
            <div className="hero-stat">
              <strong>Visible</strong>
              <span>Expiry status</span>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <img src="/hero.png" alt="" className="hero-art-image" />
        </div>
      </div>
    </section>
  );
}
