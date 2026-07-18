import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GuideIcon } from '../components/GuideIcon';
import { guides } from '../data/guides';
import { formatDate } from '../utils/format';
import '../components/GuideCard.css';

export function GuidesList() {
  return (
    <>
      <Seo
        title="Uono Guides"
        description="Practical guides for Uono and Uono Play covering how to read voucher status, why promo codes may not work, and reviewing app permissions."
        path="/guides/"
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Guides' }]} />
          <h1>Understand codes, vouchers and app access</h1>
          <p>Practical, plain-language guides for reading our records and staying safe when installing apps.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="guides-grid">
            {guides.map((guide) => (
              <article key={guide.id} className="card guide-card">
                {guide.image ? (
                  <Link to={`/guides/${guide.slug}`} className="guide-card-image">
                    <img src={guide.image} alt="" loading="lazy" />
                  </Link>
                ) : (
                  <span className="guide-card-icon" aria-hidden="true">
                    <GuideIcon slug={guide.slug} />
                  </span>
                )}
                <h3>
                  <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                </h3>
                <p>{guide.summary}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  Updated {formatDate(guide.updatedAt ?? guide.publishedAt)}
                </p>
                <Link to={`/guides/${guide.slug}`} className="btn btn-secondary btn-sm">
                  Read guide
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
