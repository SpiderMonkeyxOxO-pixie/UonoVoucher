import { Link } from 'react-router-dom';
import { guides } from '../data/guides';
import { GuideIcon } from './GuideIcon';
import './GuideCard.css';

const PREVIEW_COUNT = 3;

export function GuidesSection() {
  const preview = guides.slice(0, PREVIEW_COUNT);

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <div className="section-head-row">
          <div className="section-heading">
            <span className="eyebrow">Guides</span>
            <h2>Understand codes, vouchers and app access</h2>
          </div>
          <Link to="/guides/" className="btn btn-ghost btn-sm">
            View all guides →
          </Link>
        </div>
        <div className="guides-grid">
          {preview.map((guide) => (
            <article key={guide.id} className="card guide-card">
              <span className="guide-card-icon" aria-hidden="true">
                <GuideIcon slug={guide.slug} />
              </span>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <Link to={`/guides/${guide.slug}`} className="btn btn-secondary btn-sm">
                Read guide
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
