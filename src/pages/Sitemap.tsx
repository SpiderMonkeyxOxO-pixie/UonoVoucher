import { Link } from 'react-router-dom';
import { StaticPage } from '../components/StaticPage';
import { games } from '../data/games';
import { guides } from '../data/guides';
import { blogPosts } from '../data/blog';

const CORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/uono-games/', label: 'Uono Games' },
  { to: '/promo-codes/', label: 'Promo Codes' },
  { to: '/vouchers/', label: 'Vouchers' },
  { to: '/guides/', label: 'Guides' },
  { to: '/blog/', label: 'Blog' },
  { to: '/about/', label: 'About Us' },
  { to: '/contact/', label: 'Contact Us' },
  { to: '/editorial-policy/', label: 'Editorial Policy' },
  { to: '/code-review-policy/', label: 'Code Review Policy' },
  { to: '/corrections-policy/', label: 'Corrections Policy' },
  { to: '/disclaimer/', label: 'Disclaimer' },
  { to: '/privacy-policy/', label: 'Privacy Policy' },
  { to: '/terms/', label: 'Terms' },
];

function LinkColumn({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul style={{ columns: 2, gap: 24 }}>
        {items.map((item) => (
          <li key={item.to} style={{ marginBottom: 6 }}>
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sitemap() {
  return (
    <StaticPage
      title="Sitemap"
      description="A full list of pages available on UonoVoucher, including all documented games, promo codes, vouchers, guides and blog posts."
      path="/sitemap/"
      crumbLabel="Sitemap"
    >
      <LinkColumn title="Core pages" items={CORE_LINKS} />
      <LinkColumn
        title={`Uono games (${games.length})`}
        items={games.map((g) => ({ to: `/uono-games/${g.slug}`, label: g.name }))}
      />
      <LinkColumn
        title={`Guides (${guides.length})`}
        items={guides.map((g) => ({ to: `/guides/${g.slug}`, label: g.title }))}
      />
      <LinkColumn
        title={`Blog posts (${blogPosts.length})`}
        items={blogPosts.map((b) => ({ to: `/blog/${b.slug}`, label: b.title }))}
      />
    </StaticPage>
  );
}
