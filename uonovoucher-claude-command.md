# Claude Code Command — Build UonoVoucher

> Run this from the project directory by giving this entire file to Claude Code. Implement the project directly; do not only describe the solution.

## Mission

Build a polished, production-ready website named **UonoVoucher**.

UonoVoucher is an **independent information portal** that documents:

- 56 Uono games
- Promo-code records
- Manually added special vouchers
- Game guides
- Blog posts and updates

The site must not look like an official UonoPlay property. Use the layout geometry of a modern game catalogue, but create an original light-mode visual identity, original icons, original illustrations, and original copy.

## First actions

1. Inspect the current repository and identify the existing framework, routes, styling system, and data structure.
2. Preserve useful existing code.
3. If the repository is empty, scaffold a **Vite + React + TypeScript** project.
4. Use reusable components and structured local data.
5. Implement the site, run it locally, fix all errors, and leave it ready for preview.

## Brand positioning

Use this positioning throughout the site:

> UonoVoucher is an independent information website covering Uono games, promo codes, vouchers, updates, and practical guides.

Never claim that the website is official, affiliated with UonoPlay, endorsed by UonoPlay, or responsible for issuing the listed codes and vouchers.

## Visual direction

Create an original **light-mode** design.

### Design character

- Clean and modern
- Editorial plus game-directory feel
- Spacious but not empty
- Premium rounded cards
- Strong content hierarchy
- Clear status labels
- Responsive on desktop, tablet, and mobile

### Suggested design tokens

```css
--ink: #121426;
--muted: #6a7082;
--line: #e7e9f1;
--paper: #ffffff;
--soft: #f7f8fc;
--violet: #6338da;
--violet-2: #7f55ec;
--lime: #c9f56b;
--mint: #5ad7c1;
--orange: #ffad4a;
--radius: 20px;
```

Use accessible contrast and visible keyboard focus states.

## Layout geometry

Borrow only the broad positioning pattern of a game catalogue. Do not copy UonoPlay assets, characters, graphics, logo, typography, or exact styling.

### Desktop

- Maximum content width: `1180px`
- Header height: approximately `64–68px`
- Full-width hero height: approximately `440–470px`
- Hero grid: about `44% text / 56% visual`
- Hero text positioned toward the lower-left
- Category ribbon overlaps the bottom of the hero by about `28–32px`
- Category ribbon height: approximately `88–94px`
- Main game cards: two horizontal cards per row
- Card gap: about `20–24px`

### Tablet

- Hero remains two-column until space becomes tight
- Category ribbon may scroll horizontally
- Game cards can remain two columns when readable, otherwise switch to one

### Mobile

- Compact header with menu button
- Hero becomes one column
- Hero artwork appears below or behind the copy without reducing readability
- Category ribbon becomes a horizontal scroller
- All content grids become one column
- Buttons remain at least 44px high

## Header and navigation

Create a compact sticky or static header containing:

- Original `UV` icon mark
- Brand text: `UonoVoucher`
- Home
- Uono Games
- Promo Codes
- Vouchers
- Guides
- Blog
- A highlighted `Latest Updates` button
- Mobile navigation drawer or dropdown

Active navigation states must be visible.

## Homepage sections

### 1. Hero

Use this headline:

**Uono games, promo codes and voucher updates**

Supporting text:

> Browse independent information for 56 documented Uono games, manually reviewed promo-code records, special vouchers, and practical guides.

Buttons:

- Explore Uono Games
- View Latest Vouchers

Include small statistics:

- 56 documented games
- Manually reviewed records
- Visible expiry status

Add a small notice:

> Independent information portal

Create original abstract voucher/game artwork using CSS shapes, gradients, icons, or locally generated vector-style components. Do not hotlink or copy game artwork.

### 2. Overlapping category ribbon

Create five category items:

- Slots
- Skill
- Multiplayer
- Fight / Flight
- Fishing

Each item needs:

- Original icon
- Category name
- Small supporting label
- Hover and active states
- Link or filtering behavior

### 3. Games directory preview

Heading:

**Our documented Uono games**

Supporting text:

> Browse a structured selection from the 56 games currently tracked by UonoVoucher.

Add:

- Category filters
- Search field
- `View all 56 games` link
- Two-column horizontal game-card grid on desktop

Each game card must contain:

- Original placeholder artwork or monogram
- Game name
- Category
- Brief neutral description
- Published date
- Last-reviewed date
- Promo-code status
- Voucher status where relevant
- `View details` action

Use sample records such as:

- Fortunate Jaguar
- Wild Bounty Showdown
- Colour Prediction
- Ocean King

Do not present the sample information as guaranteed official data. Label the records as examples or local seed data where necessary.

### 4. Promo-code tracker

Heading:

**Clear status, dates and source notes**

Display a clean table or responsive card list with:

- Game
- Category
- Code
- Status
- Last checked
- Copy button

Supported statuses:

- Checked
- Reported
- Unconfirmed
- Expired
- Withdrawn

Copy buttons must work and show a temporary success toast.

Expired code buttons must be disabled.

### 5. Special vouchers

Heading:

**Manually added voucher records**

Create three premium voucher cards. Each record needs:

- Voucher title
- Related game or category
- Code
- Eligibility note
- Start date
- Expiry date
- Status
- Last reviewed
- Source note
- `View voucher details` action

Supported voucher statuses:

- Scheduled
- Active
- Limited
- Reported
- Unconfirmed
- Expired
- Withdrawn

The voucher design may resemble a ticket shape but must be original.

### 6. Guides

Heading:

**Understand codes, vouchers and app access**

Add three guide cards:

- How to check whether a Uono voucher has expired
- Why a promo code may not work
- Review app permissions before installation

### 7. Transparency section

Add a strong trust panel:

**Independent information, clearly labelled**

Copy:

> UonoVoucher does not operate the games listed or issue their vouchers. Review dates and expired records remain visible for transparency.

Link to:

- Editorial Policy
- Code Review Policy
- Corrections Policy

### 8. Footer

Create four footer columns:

1. Brand summary
2. Explore
3. Information
4. Legal

Include links for:

- All Uono Games
- Promo Codes
- Special Vouchers
- Guides
- Blog
- About Us
- Editorial Policy
- Code Review Policy
- Corrections Policy
- Contact Us
- Disclaimer
- Privacy Policy
- Terms
- Sitemap

Footer disclaimer:

> UonoVoucher is an independent informational website and is not affiliated with or endorsed by UonoPlay. Game names and trademarks belong to their respective owners. Codes and vouchers may change or expire without notice.

## Required routes

Create these routes or pages:

```text
/
/uono-games/
/uono-games/:slug
/promo-codes/
/promo-codes/:slug
/vouchers/
/vouchers/:slug
/guides/
/guides/:slug
/blog/
/blog/:slug
/about/
/contact/
/editorial-policy/
/code-review-policy/
/corrections-policy/
/disclaimer/
/privacy-policy/
/terms/
/sitemap/
```

If using a purely static implementation, provide equivalent generated HTML pages or route handling.

## Data architecture

Create structured data files or TypeScript objects for:

### Game

```ts
interface Game {
  id: string;
  slug: string;
  name: string;
  category: 'slots' | 'skill' | 'multiplayer' | 'fight-flight' | 'fishing';
  summary: string;
  publishedAt?: string;
  reviewedAt: string;
  codeStatus: 'checked' | 'reported' | 'unconfirmed' | 'expired' | 'none';
  voucherStatus: 'active' | 'reported' | 'expired' | 'none';
  featured?: boolean;
}
```

### Promo code

```ts
interface PromoCode {
  id: string;
  gameId: string;
  code: string;
  status: 'checked' | 'reported' | 'unconfirmed' | 'expired' | 'withdrawn';
  addedAt: string;
  checkedAt?: string;
  expiresAt?: string;
  eligibility?: string;
  sourceNote?: string;
}
```

### Voucher

```ts
interface Voucher {
  id: string;
  slug: string;
  title: string;
  gameId?: string;
  code: string;
  status: 'scheduled' | 'active' | 'limited' | 'reported' | 'unconfirmed' | 'expired' | 'withdrawn';
  description: string;
  eligibility?: string;
  startsAt?: string;
  expiresAt?: string;
  reviewedAt: string;
  sourceNote?: string;
}
```

### Blog post

```ts
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
}
```

Seed enough data to make every section look complete. Prepare the architecture to support all 56 games, but do not fabricate official facts for every game.

## Functional requirements

Implement and test:

- Responsive navigation
- Game search
- Game-category filtering
- Copy-code functionality
- Success toast
- Disabled expired codes
- Working internal navigation
- Empty-state message when no game matches a search
- Semantic HTML
- Keyboard navigation
- Reduced-motion support
- No console errors
- No broken links in the core preview flow

## SEO requirements

Use natural language. Do not repeat `Uono` unnaturally.

Homepage metadata:

```text
Title: Uono Games, Promo Codes and Vouchers | UonoVoucher
Description: Explore independent information about documented Uono games, promo-code records, special vouchers, expiry updates and practical guides.
```

Homepage H1:

```text
Uono games, promo codes and voucher updates
```

Add:

- Canonical placeholder or configurable site URL
- Open Graph metadata
- Twitter card metadata
- Organization or WebSite structured data only when accurate
- Breadcrumbs on inner pages
- Unique title and description for every route

Do not use claims such as:

- Official Uono website
- Guaranteed code
- Guaranteed voucher
- Instant earnings
- Easy money
- Play now and win

## Copyright and identity constraints

Strictly follow these rules:

- Do not copy the UonoPlay logo
- Do not copy its hero characters
- Do not reuse screenshots from UonoPlay
- Do not duplicate its exact colours or typography
- Do not use copyrighted game art without supplied permission
- Do not imply affiliation
- Use original placeholder illustrations, CSS artwork, icons, or licensed assets only

## Code quality

- Use TypeScript when using React
- Use reusable components
- Keep data separate from presentation
- Avoid unnecessary dependencies
- Do not use inline styles for the full application
- Keep CSS maintainable and responsive
- Add clear component and data naming
- Remove dead code and placeholder debug output

## Deliverables

Complete all of the following:

1. Build the homepage and required core routes.
2. Add reusable data models and seed content.
3. Implement search, filters, mobile navigation, and copy actions.
4. Run the application locally.
5. Fix build, lint, type, and browser-console errors.
6. Provide a final summary containing:
   - Files created or modified
   - Local preview URL
   - Build command
   - Production build result
   - Any remaining placeholder content

## Local preview

For a new Vite project, configure scripts so these work:

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
```

Start the preview server and keep it running long enough to verify the page.

## Final instruction

Implement the website now. Do not stop after generating a plan. Inspect the rendered result, compare it against the layout requirements, correct visible spacing or responsiveness problems, and leave the project in a working state.
