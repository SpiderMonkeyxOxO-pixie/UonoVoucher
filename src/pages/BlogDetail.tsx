import { Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FaqAccordion } from '../components/FaqAccordion';
import { RichContent } from '../components/RichContent';
import { getBlogPostBySlug } from '../data/lookups';
import { formatDate } from '../utils/format';

export function BlogDetail() {
  const { slug = '' } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) return <Navigate to="/blog/" replace />;

  return (
    <>
      <Seo title={post.metaTitle ?? post.title} description={post.metaDescription ?? post.excerpt} path={`/blog/${post.slug}`} />
      <StructuredData
        id={`blog-${post.slug}`}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog/' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        faq={post.faqs}
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog/' }, { label: post.title }]} />
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <p style={{ fontSize: '0.82rem' }}>
            Published {formatDate(post.publishedAt)}
            {post.updatedAt && ` · Updated ${formatDate(post.updatedAt)}`}
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
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
            {post.content ? (
              <RichContent content={post.content} />
            ) : (
              (post.body ?? [post.excerpt]).map((para, i) => <p key={i}>{para}</p>)
            )}
            {post.faqs && post.faqs.length > 0 && (
              <>
                <h2>Frequently Asked Questions</h2>
                <FaqAccordion items={post.faqs} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
