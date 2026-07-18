# Claude Code Command — Build the UonoVoucher Promo Code Updates Page

You are working inside the existing **UonoVoucher** website project.

Create a complete, production-ready **Promo Code Updates** page inspired by the functional structure of:

`https://allyonoupdate.com/promo-code-updates/`

Use the reference for functionality and content organization only. Do not clone its branding, colors, typography, wording, footer, or visual identity.

The UonoVoucher implementation must use the website’s existing design language and must be **light mode only**.

---

## Primary Objective

Build a reusable, data-driven promo-code directory for all UonoVoucher game records.

The page should allow visitors to:

- Browse promo-code updates for every listed game
- View separate morning, afternoon, and evening records
- Copy an available code
- Recognize unavailable, expired, pending, and unconfirmed records
- Open the related game profile
- Open the external download source
- Search and filter the game list
- See when each record was checked or reviewed

The result must feel like a polished UonoVoucher product page, not a copied third-party page.

---

## Required Route

Use the project’s existing route conventions.

Preferred route:

`/promo-codes`

If this route already exists, enhance it instead of creating a duplicate.

Preserve all existing URLs and navigation behavior.

Add or update the main navigation link labelled:

`Promo Codes`

---

# Non-Negotiable Design Rule: Light Mode Only

The entire page must remain in light mode.

Do not create or inherit a dark theme for this page.

Do not use:

- Black page backgrounds
- Near-black cards
- Dark navy content panels
- Dark-mode media queries
- Theme toggles
- `prefers-color-scheme: dark`
- Automatically inverted colors
- Dark promo-code cards like those shown on the current inner page

Use a clean light palette based on the existing UonoVoucher interface.

Suggested palette:

```css
--page-bg: #f7f7fc;
--surface: #ffffff;
--surface-soft: #f3f0ff;
--surface-muted: #f5f6fa;
--border: #e4e5ee;
--heading: #17172b;
--body: #42465a;
--muted: #73798f;
--primary: #6842e8;
--primary-hover: #5632cf;
--primary-soft: #eee9ff;
--success: #14875c;
--success-soft: #eaf8f1;
--warning: #a56708;
--warning-soft: #fff5dc;
--danger: #c64343;
--danger-soft: #fff0f0;
```

Adapt these values to existing project variables where possible.

All cards should have white or lightly tinted backgrounds with subtle borders and restrained shadows.

---

# Before Editing

1. Inspect the project structure.
2. Identify the framework, routing system, styling system, and component conventions.
3. Locate the current game data source.
4. Locate existing promo-code and voucher fields.
5. Locate existing game icons, slugs, download links, status values, and review dates.
6. Reuse current data instead of duplicating game records.
7. Inspect the existing copy-code interaction before replacing it.
8. Confirm whether the project uses static data, JSON, TypeScript, Markdown, MDX, a database, or a CMS.
9. Preserve all existing working routes and shared components.

Do not stop at analysis. Proceed with implementation.

---

# Page Architecture

Build the page using this structure:

1. Breadcrumb
2. Light hero section
3. Summary statistics
4. Search and filters
5. Quick platform navigation
6. Promo-code card grid
7. Editorial notice
8. Related links
9. Frequently asked questions

---

## 1. Breadcrumb

Add a compact breadcrumb above the hero.

Example:

`Home / Promo Codes`

Requirements:

- Semantic navigation
- Current page is not clickable
- Clear keyboard focus state
- Matches the existing UonoVoucher breadcrumb style

---

## 2. Light Hero Section

Create a clean light hero with:

### Eyebrow

`PROMO CODE TRACKER`

### Main heading

`Latest Uono Game Promo Codes`

### Supporting copy

Use neutral wording explaining that codes are recorded by game and release period.

Do not claim that every code is official, guaranteed, active, or verified.

### Hero actions

Include:

- `Browse Promo Codes`
- `View All Games`

The first action should scroll to the directory.

### Hero information

Display:

- Last page update
- Number of listed games
- Number of currently available code entries
- Number awaiting an update

Calculate these values from the data.

Do not hardcode the totals.

### Hero appearance

Use:

- White or soft lavender background
- Subtle border
- Gentle decorative gradient or abstract shapes
- No black or dark container
- No excessive illustration
- No gambling imagery
- No flashing effects

---

## 3. Summary Statistics

Add a responsive summary row below the hero.

Suggested cards:

- Games tracked
- Codes available
- Awaiting release
- Last reviewed

Each card should:

- Use a small icon
- Include a label and value
- Use a white background
- Have a subtle border
- Avoid bright saturated blocks

Values must be calculated from live page data.

---

## 4. Search and Filters

Create a sticky or easily accessible light filter bar.

Include:

### Search input

Placeholder:

`Search by game name`

Search should update the displayed cards instantly.

### Category filter

Use categories from the real game data, such as:

- All
- Rummy
- Slots
- Arcade
- Bingo
- 777
- VIP
- Other

Do not hardcode categories that are not present.

### Availability filter

Options:

- All statuses
- Code available
- Partially available
- Awaiting release
- Expired
- Unconfirmed

### Release-period filter

Options:

- All periods
- Morning
- Afternoon
- Evening

### Sort control

Options:

- A–Z
- Recently checked
- Available first

### Filter behavior

- Filters must work together
- Add a visible result count
- Add a `Clear filters` action
- Keep filter state in the URL query string when practical
- Use accessible labels
- On mobile, filters may open in a light modal or collapsible panel

Do not create a dark overlay panel.

---

## 5. Quick Platform Navigation

Add a compact alphabetical jump section above the card directory.

Possible formats:

- A–Z letters
- Compact game-name chips
- Grouped category links

Use real game slugs and anchor IDs.

The purpose is to help users move through a directory containing approximately 56 games without excessive scrolling.

On mobile, make the navigation horizontally scrollable.

---

# Promo-Code Directory

## Responsive Layout

Use:

- Three columns on wide screens when card width remains readable
- Two columns on medium screens
- One column on mobile

Keep card heights reasonably consistent without forcing large empty spaces.

Do not place small cards inside oversized containers.

---

## Reusable PromoCodeCard Component

Create one reusable card for every game.

Each card must include:

### Card header

- Game icon
- Game name
- Category
- Overall promo-code status badge
- Link to the game profile

The game name should link to the existing game detail page.

### Release tabs

Use three accessible tabs:

- AM
- PM
- Eve

The labels shown inside each tab panel should be:

- Morning
- Afternoon
- Evening

The selected tab must have a visible light-mode active state using purple or green accents.

Tabs must:

- Be keyboard accessible
- Use proper tab roles when appropriate
- Preserve independent state for each card
- Not cause page navigation
- Avoid layout shift

### Code panel

For an available code, display:

- Release-period label
- Code text
- Copy button
- Status
- Checked date and time, when available
- Optional source note, when available

Example statuses:

- Available
- Unconfirmed
- Expired
- Awaiting release
- No code recorded

Do not treat text such as `Check Mail Box` as a normal promo code unless the data explicitly marks it as copyable information.

### Copy behavior

- Copy only real code content
- Change the button label to `Copied`
- Show a check icon after success
- Restore the label after a short delay
- Add an accessible live-region confirmation
- Handle clipboard failure gracefully
- Do not copy placeholder text such as `Not released yet`

### Action footer

Include:

- `View Game`
- `Download`

The download button must:

- Use the existing external URL
- Clearly indicate that it opens an external site
- Use `target="_blank"` and safe `rel` attributes when appropriate
- Be disabled or hidden when no URL exists

The game-profile action should be the primary internal action.

---

# Status Logic

Create a consistent status system.

## Available

Use when the selected period has a usable code.

Appearance:

- Green text
- Pale green background
- Text label and icon

## Partially Available

Use when at least one release period has a code and at least one does not.

Appearance:

- Purple or amber accent
- Explicit label

## Awaiting Release

Use for a future or missing release-period update.

Appearance:

- Muted amber
- Clock icon
- `Awaiting release`

## Expired

Use when the data explicitly marks the code as expired.

Appearance:

- Pale red
- `Expired`
- Copy action disabled

## Unconfirmed

Use when a code exists but has not been confirmed.

Appearance:

- Neutral grey or pale lavender
- `Unconfirmed`

Do not rely on color alone. Every state must include text.

---

# Data Model

Extend or normalize the existing promo-code data so every game can support independent release-period records.

Use the project’s actual schema conventions, but target an equivalent structure:

```ts
type PromoStatus =
  | "available"
  | "unconfirmed"
  | "expired"
  | "awaiting"
  | "unavailable";

type PromoEntry = {
  value?: string;
  status: PromoStatus;
  checkedAt?: string;
  releasedAt?: string;
  sourceNote?: string;
  copyable?: boolean;
};

type GamePromoRecord = {
  slug: string;
  name: string;
  icon: string;
  category: string;
  gameUrl: string;
  downloadUrl?: string;
  overallStatus?: PromoStatus | "partial";
  lastReviewed?: string;
  periods: {
    morning?: PromoEntry;
    afternoon?: PromoEntry;
    evening?: PromoEntry;
  };
};
```

Do not duplicate data that is already available elsewhere.

Prefer a normalized relation to existing game records.

---

# Manual Update Workflow

The page must be easy for the site owner to update several times per day.

Implement a clean content-management structure where each game’s morning, afternoon, and evening entry can be changed independently.

Requirements:

- One source of truth
- Human-readable data structure
- ISO dates internally
- Display dates formatted consistently
- No need to edit React component markup to change a code
- Missing entries should render a safe empty state
- Invalid data should not break the page
- Development-time validation should report missing slugs, duplicate games, and malformed status values

If the project uses TypeScript, add strong types.

If practical, add a lightweight schema validator using an existing dependency. Do not introduce a large dependency solely for this feature.

---

# Important UX Improvements Over the Reference

Implement the useful core functionality, but improve the experience for a large directory:

- Add search
- Add category and status filters
- Add result counts
- Add alphabetical navigation
- Avoid an excessively long undifferentiated list
- Keep cards compact
- Use pagination, `Load more`, or grouped sections if performance requires it
- Preserve all records in the rendered HTML when SEO requirements make client-only pagination undesirable
- Add clear empty states
- Add skeletons only if data loads asynchronously
- Do not create a visually heavy page

---

# Editorial Notice

Below the directory, add one well-designed light notice card.

Suggested heading:

`Before Using a Promo Code`

Use neutral wording explaining:

- Codes may change by time, app version, account, or platform notice
- A listed code is not guaranteed to remain active
- External download links are operated by third parties
- UonoVoucher does not request passwords, OTPs, payment details, or private screenshots
- Visitors should check the date and status before relying on an entry

Do not repeat the same warning under every card.

Keep the notice factual and concise.

---

# Related Links Section

Add three or four light cards linking to relevant internal pages:

- All Uono Games
- Vouchers
- Guides
- Editorial Policy

Use existing routes.

Do not create broken placeholder links.

---

# FAQ Section

Create an accessible accordion.

Suggested questions:

1. How often are promo codes reviewed?
2. What does “Awaiting release” mean?
3. Are promo codes active for the whole day?
4. Why is a code marked unconfirmed?
5. Where does the download button lead?
6. How can outdated information be reported?

Write answers in UonoVoucher’s own wording.

Do not copy the reference page’s text.

Only add FAQ structured data when the visible FAQ content matches it exactly.

---

# Light-Mode Component Styling

## Page

- Very light grey or lavender background
- Dark navy text
- Maximum content width consistent with the current site
- Generous but controlled vertical spacing

## Cards

- White background
- Border around `#e4e5ee`
- Border radius between 16px and 22px
- Very soft shadow
- No glassmorphism requiring dark backgrounds

## Tabs

Inactive:

- White or soft grey background
- Muted text
- Thin border

Active:

- Pale purple or pale green background
- Strong text
- Clear border
- No neon glow

## Buttons

Primary:

- Existing UonoVoucher purple
- White text

Secondary:

- White background
- Purple or navy text
- Visible border

Copy:

- Pale green or pale purple background
- Strong accessible text

Disabled:

- Soft grey background
- Muted text
- `not-allowed` cursor

## Typography

- Reuse existing site fonts
- Serif may be used for the page heading
- Sans serif for controls, labels, cards, codes, and body text
- Use a monospace font only for code values
- Do not reduce important text below a comfortable reading size

---

# Mobile Requirements

The page must work well from 320px upward.

On mobile:

- Stack the hero statistics
- Use one promo card per row
- Keep the search bar visible
- Move advanced filters into a collapsible light panel
- Make tabs full width
- Prevent long code values from breaking the layout
- Allow code values to wrap or truncate with a reveal control
- Keep copy buttons easy to tap
- Make alphabetical navigation horizontally scrollable
- Avoid horizontal page overflow
- Do not use fixed-width cards
- Do not create excessive blank vertical space

---

# Accessibility

- Use semantic landmarks
- Use a logical heading order
- Add visible focus states
- Ensure all controls are keyboard accessible
- Add alt text to game icons
- Use real buttons for tabs and copy actions
- Add `aria-live` feedback for clipboard actions
- Ensure status is conveyed by text and icon, not color alone
- Maintain WCAG-friendly contrast
- Respect reduced-motion preferences
- Ensure filters have associated labels
- Ensure accordion interactions work by keyboard

---

# SEO and Structured Data

Implement:

- Unique page title
- Meta description
- Canonical URL
- Open Graph title and description
- Breadcrumb structured data
- FAQ structured data when applicable
- `WebPage` or `CollectionPage` structured data
- Semantic headings
- Crawlable internal game links

Suggested intent:

- Promo-code status directory
- Daily game code updates
- Morning, afternoon, and evening availability

Do not add:

- Fake review ratings
- Fake availability guarantees
- Fake official status
- Fake authors
- Fake update times
- Keyword-stuffed paragraphs

---

# Performance Requirements

- Reuse optimized game icons
- Lazy-load images below the fold
- Avoid loading all card interactions as separate heavy components when unnecessary
- Minimize client-side JavaScript
- Use server rendering or static generation where supported
- Use memoization only when useful
- Prevent cumulative layout shift
- Avoid oversized images
- Keep filter interactions responsive with all game records loaded
- Do not install a large UI library

---

# Error and Empty States

Handle:

- No promo data
- Missing icon
- Missing game URL
- Missing download URL
- No filter results
- Clipboard failure
- Invalid date
- Duplicate slug
- Unknown status
- All three periods unavailable

Suggested empty-state copy:

`No promo-code update is recorded for this release period.`

Do not render `undefined`, empty buttons, broken links, or empty cards.

---

# Content Integrity Rules

- Do not invent codes
- Do not invent review dates
- Do not mark a code verified unless the data supports it
- Do not transform unrelated notices into promo codes
- Do not present UonoVoucher as the operator of external game platforms
- Do not imply guaranteed benefits
- Do not use aggressive promotional wording
- Do not describe the external site as safe without evidence
- Preserve unique data for every game

---

# Testing Checklist

After implementation:

1. Run the development server.
2. Open `/promo-codes`.
3. Verify light mode on desktop, tablet, and mobile.
4. Confirm that no dark backgrounds appear.
5. Test search.
6. Test every filter.
7. Test sorting.
8. Test AM, PM, and Eve tabs on multiple cards.
9. Test code-copy success and failure.
10. Confirm placeholders cannot be copied.
11. Test game-profile links.
12. Test external download links.
13. Test missing-code and missing-download states.
14. Check keyboard navigation.
15. Check mobile overflow.
16. Run linting.
17. Run the production build.
18. Fix all errors and meaningful warnings.
19. Confirm existing routes still work.
20. Confirm all game records are sourced from existing data.

---

# Final Response Required From Claude

After implementation, provide:

- Summary of the page created
- Route used
- Files changed
- Components created
- Data-model changes
- Search and filter behavior
- Copy-code behavior
- Light-mode styling decisions
- Tests completed
- Any data records that still require manual entry

Proceed with the actual implementation. Do not return only design recommendations or sample code.
