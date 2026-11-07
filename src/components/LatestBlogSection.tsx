import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';

const PREVIEW_COUNT = 3;

export function LatestBlogSection() {
  const preview = [...blogPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, PREVIEW_COUNT);

  if (preview.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--paper)' }}>
      <div className="container">
        <div className="section-head-row">
          <div className="section-heading">
            <span className="eyebrow">From the blog</span>
            <h2>Latest promo-code and status updates</h2>
          </div>
          <Link to="/blog/" className="btn btn-ghost btn-sm">
            View all articles →
          </Link>
        </div>
        <div className="guides-grid">
          {preview.map((post) => (
            <article key={post.id} className="card guide-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}/`} className="btn btn-secondary btn-sm">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
