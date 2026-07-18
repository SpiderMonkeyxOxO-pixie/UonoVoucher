import { Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FaqAccordion } from '../components/FaqAccordion';
import { RichContent } from '../components/RichContent';
import { getGuideBySlug } from '../data/lookups';
import { formatDate } from '../utils/format';

export function GuideDetail() {
  const { slug = '' } = useParams();
  const guide = getGuideBySlug(slug);

  if (!guide) return <Navigate to="/guides/" replace />;

  return (
    <>
      <Seo
        title={guide.metaTitle ?? guide.title}
        description={guide.metaDescription ?? guide.summary}
        path={`/guides/${guide.slug}`}
      />
      <StructuredData
        id={`guide-${guide.slug}`}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides/' },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
        faq={guide.faqs}
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }, { label: 'Guides', to: '/guides/' }, { label: guide.title }]}
          />
          <h1>{guide.title}</h1>
          <p style={{ fontSize: '0.82rem' }}>
            Published {formatDate(guide.publishedAt)}
            {guide.updatedAt && ` · Updated ${formatDate(guide.updatedAt)}`}
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          {guide.image && (
            <img
              src={guide.image}
              alt={guide.title}
              style={{
                width: '100%',
                maxWidth: 720,
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: 12,
              }}
            />
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 720 }}>
            {guide.content ? (
              <RichContent content={guide.content} />
            ) : (
              (guide.body ?? [guide.summary]).map((para, i) => <p key={i}>{para}</p>)
            )}
            {guide.faqs && guide.faqs.length > 0 && (
              <>
                <h2>Frequently Asked Questions</h2>
                <FaqAccordion items={guide.faqs} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
