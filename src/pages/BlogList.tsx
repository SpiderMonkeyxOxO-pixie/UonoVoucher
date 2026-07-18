import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { blogPosts } from '../data/blog';
import { formatDate } from '../utils/format';
import '../components/BlogCard.css';

export function BlogList() {
  const sorted = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <Seo
        title="Uono & Uono Play Blog"
        description="Uono and Uono Play updates, review-cycle notes and corrections from the UonoVoucher team."
        path="/blog/"
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
          <h1>Latest updates</h1>
          <p>Review-cycle notes, corrections, and context on how UonoVoucher tracks records.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {sorted.map((post) => (
              <article key={post.id} className="card blog-card">
                {post.image && (
                  <Link to={`/blog/${post.slug}`} className="blog-card-image">
                    <img src={post.image} alt="" loading="lazy" />
                  </Link>
                )}
                <span className="blog-card-category">{post.category}</span>
                <h3>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="excerpt">{post.excerpt}</p>
                <p className="blog-meta">
                  {formatDate(post.publishedAt)}
                  {post.updatedAt && ` · Updated ${formatDate(post.updatedAt)}`}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
