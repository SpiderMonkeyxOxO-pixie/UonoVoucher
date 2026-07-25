import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = 'https://uonovoucher.com';
const today = new Date().toISOString().slice(0, 10);

// Some hosts (aaPanel) auto-drop a .user.ini file into the site's web root,
// which is this project's build output dir. Vite's own emptyOutDir step chokes
// on it (ENOENT: not a directory, scandir '.../dist/.user.ini'), so clear dist/
// ourselves before vite build ever runs, rather than relying on vite to do it.
rmSync(join(root, 'dist'), { recursive: true, force: true });

function extractGames() {
  const src = readFileSync(join(root, 'src/data/games.ts'), 'utf8');
  // Split on top-level array-item boundaries rather than anchoring on any one field
  // (e.g. "downloadUrl"), since not every game has every optional field.
  const chunks = src.split(/\n  \{\n/).slice(1);
  return chunks
    .map((o) => ({
      slug: (o.match(/"slug":\s*"([^"]+)"/) || [])[1],
      lastmod: (o.match(/"reviewedAt":\s*"([^"]+)"/) || [])[1],
    }))
    .filter((g) => g.slug);
}

function extractPromoCodes() {
  const src = readFileSync(join(root, 'src/data/promoCodes.ts'), 'utf8');
  const objs = src.match(/\{[^{}]*"id":\s*"[^"]+"[^{}]*\}/g) || [];
  return objs.map((o) => ({
    id: (o.match(/"id":\s*"([^"]+)"/) || [])[1],
    lastmod: (o.match(/"checkedAt":\s*"([^"]+)"/) || o.match(/"addedAt":\s*"([^"]+)"/) || [])[1],
  }));
}

function extractContentEntries(file) {
  const src = readFileSync(join(root, file), 'utf8');
  const objs = src.split(/\n  \{\n/).slice(1);
  return objs.map((chunk) => ({
    slug: (chunk.match(/slug:\s*'([^']+)'/) || [])[1],
    lastmod: (chunk.match(/updatedAt:\s*'([^']+)'/) || chunk.match(/publishedAt:\s*'([^']+)'/) || [])[1],
  })).filter((e) => e.slug);
}

const games = extractGames();
const promoCodes = extractPromoCodes();
const guides = extractContentEntries('src/data/guides.ts');
const blogPosts = extractContentEntries('src/data/blog.ts');

const staticEntries = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/uono-games/', priority: '0.9', changefreq: 'daily' },
  { path: '/promo-codes/', priority: '0.9', changefreq: 'daily' },
  { path: '/vouchers/', priority: '0.7', changefreq: 'weekly' },
  { path: '/guides/', priority: '0.7', changefreq: 'weekly' },
  { path: '/blog/', priority: '0.7', changefreq: 'daily' },
  { path: '/about/', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact/', priority: '0.3', changefreq: 'monthly' },
  { path: '/editorial-policy/', priority: '0.3', changefreq: 'monthly' },
  { path: '/code-review-policy/', priority: '0.3', changefreq: 'monthly' },
  { path: '/corrections-policy/', priority: '0.3', changefreq: 'monthly' },
  { path: '/disclaimer/', priority: '0.3', changefreq: 'monthly' },
  { path: '/privacy-policy/', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms/', priority: '0.3', changefreq: 'monthly' },
  { path: '/sitemap/', priority: '0.2', changefreq: 'monthly' },
];

const urls = [
  ...staticEntries.map((e) => ({ loc: e.path, lastmod: today, priority: e.priority, changefreq: e.changefreq })),
  ...games.map((g) => ({ loc: `/uono-games/${g.slug}`, lastmod: g.lastmod || today, priority: '0.6', changefreq: 'weekly' })),
  ...promoCodes.map((p) => ({ loc: `/promo-codes/${p.id}`, lastmod: p.lastmod || today, priority: '0.5', changefreq: 'daily' })),
  ...guides.map((g) => ({ loc: `/guides/${g.slug}`, lastmod: g.lastmod || today, priority: '0.7', changefreq: 'monthly' })),
  ...blogPosts.map((b) => ({ loc: `/blog/${b.slug}`, lastmod: b.lastmod || today, priority: '0.7', changefreq: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml generated with ${urls.length} URLs`);
