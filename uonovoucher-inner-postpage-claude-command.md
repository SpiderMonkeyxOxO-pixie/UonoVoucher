# Claude Code Command — Enhance UonoVoucher Inner / Post Pages

You are working on the existing **UonoVoucher** website.

Your task is to redesign and improve the **inner game post page** while preserving the current brand identity, routing, data structure, and existing functionality.

Use the current **Bingo 101** page as the reference implementation and apply the new design as a reusable template for every game detail page.

## Main Goal

Transform the current post page into a polished, trustworthy, content-rich game profile page that feels consistent with the UonoVoucher homepage.

The finished page should look professional, modern, clean, spacious, and editorial rather than like a simple database record.

Do not rebuild the entire website. Focus on the game detail/post page and reusable components used by that page.



## Critical Requirement: Every Game Page Must Have Unique Content

Every game page must contain genuinely unique editorial content. Do not reuse the same paragraphs with only the game name changed.

The shared page layout and reusable UI components may remain consistent, but the written content must be specific to each game.

For every game record, create or load unique content for:

- Hero summary
- About section
- Game overview
- Category description
- Gameplay or format explanation
- Platform and access notes
- Promo-code explanation
- Voucher explanation
- Status commentary
- Safety and permissions notes
- Review observations
- Frequently asked questions
- Meta title
- Meta description
- Open Graph description
- Related-game rationale

### Uniqueness Rules

- Do not use a universal paragraph template with variable substitution.
- Do not replace only the game title, category, or date.
- Do not repeat identical introductions, conclusions, FAQs, or safety notices across all game pages.
- Avoid sentence-level duplication between game pages.
- Shared legal or editorial disclaimers may use a consistent core statement, but the surrounding explanation must be adapted to the specific game record.
- Do not invent facts to make content appear unique.
- When data is limited, write a shorter factual page instead of padding it with generic text.
- Keep each page neutral, natural, and written for a real reader.
- Do not create spun, awkward, or synonym-swapped copy.

### Recommended Game Content Schema

Extend the game data model so every game can store unique page content.

Suggested fields:

```ts
{
  slug: string,
  name: string,
  category: string,
  shortSummary: string,
  overview: string[],
  formatNotes?: string[],
  accessNotes?: string[],
  promoExplanation?: string[],
  voucherExplanation?: string[],
  reviewNotes?: string[],
  safetyNotes?: string[],
  faqs?: {
    question: string,
    answer: string
  }[],
  metaTitle: string,
  metaDescription: string
}
```

Use the project’s actual language and schema conventions.

Do not place all long-form game content inside a shared React component. Keep content in the existing data source, CMS, JSON, Markdown, MDX, database, or content collection used by the project.

### Content Rendering Logic

- Shared components control appearance only.
- Game-specific data controls the wording.
- Hide sections that do not have meaningful content.
- Do not render generic filler to make every page the same length.
- Support different section order when a game requires it.
- Allow some games to have additional custom sections.
- Keep headings dynamic and relevant to the individual game.

### Content Audit

Before finishing, compare at least five game pages and verify:

1. Their introductions are different.
2. Their main descriptions are specific to the game.
3. Their FAQs are not copied.
4. Their metadata is unique.
5. Their section content is not produced by simple name replacement.
6. Their safety and review notes reflect the available data.
7. Their related games are contextually selected.

Create a temporary duplicate-content audit script if useful. It should detect identical or near-identical paragraphs across game records and report them before the final build.


---

## Before Editing

1. Inspect the project structure.
2. Find the route, template, and components responsible for individual game pages.
3. Identify how game information, promo codes, status labels, vouchers, images, and download links are loaded.
4. Reuse the existing data source instead of hardcoding Bingo 101.
5. Preserve all working routes and existing game records.
6. Do not alter the homepage design unless a shared component requires a small compatibility update.

---

## Design Direction

Retain the existing UonoVoucher visual language:

- White and very light lavender backgrounds
- Deep navy headings
- Purple primary actions
- Green for active promo-code actions
- Soft grey secondary text
- Rounded cards
- Generous spacing
- Subtle borders and shadows
- Serif font for major page headings
- Clean sans-serif font for labels, navigation, buttons, and body content

The page must feel premium and structured, not crowded.

---

## New Page Structure

### 1. Breadcrumb Section

Keep the breadcrumb above the main game information.

Example:

`Home / Uono Games / Bingo 101`

Requirements:

- Compact and readable
- Proper hover states
- Current page should not be clickable
- Include semantic breadcrumb markup when possible

---

### 2. Improved Game Hero

Redesign the top section into a polished game profile hero.

Include:

- Game icon
- Category label
- Game title
- One-sentence summary
- Verification/status badge
- Promo availability badge
- Last reviewed date
- Primary download button
- Secondary button linking to promo codes
- Optional voucher button only when voucher data exists

Recommended layout:

- Left: icon and main game details
- Right: compact information panel or action area
- Stack cleanly on mobile

Do not show an “Expired” badge beside the main game title unless the entire game record is expired. Promo-code expiry should be displayed inside the promo section.

Status colors must be clear but not overly bright.

---

### 3. Quick Information Grid

Add a reusable information grid directly below the hero.

Possible fields:

- Game category
- Platform
- Current status
- Promo-code status
- Voucher availability
- Last checked
- External download source
- Review status

Only render fields that exist in the data.

Use compact cards or bordered cells. Do not invent missing information.

---

### 4. Main Two-Column Content Layout

On desktop, create:

- Main content column: approximately 65–70%
- Sidebar: approximately 30–35%

On tablet and mobile, stack everything into one column.

The sidebar can become sticky on desktop, but it must not overlap the footer or header.

---

## Main Content Sections

### Game Overview

Add a clear section titled:

`About Bingo 101`

Use the game title dynamically.

Display the existing introduction in a readable content block. Improve typography, paragraph width, and spacing.

Do not generate promotional claims or unsupported facts.

---

### Promo Codes

Redesign the promo-code area.

Do not place a small card inside a very large empty dark container.

Instead:

- Use a properly sized promo section
- Display promo cards in a responsive grid
- Show AM, PM, and Evening codes clearly
- Include code status
- Include last checked date
- Include copy-code interaction
- Show a visual confirmation after copying
- Disable or label expired codes clearly
- Keep the download action visually separate from the copy-code action
- Include an empty state when no promo code is available

Suggested heading:

`Latest Promo Codes for Bingo 101`

Add a small explanatory sentence below the heading.

Use green only for valid code actions. Use muted grey or red for expired codes.

---

### Voucher Section

Render this section only when voucher data exists.

Include:

- Voucher title
- Voucher code or value
- Validity/status
- Copy button
- Redemption note
- Last checked date

Do not show an empty voucher section.

---

### Game Details / How It Works

Create a reusable editorial content section.

Possible heading:

`Game Information`

Use existing content when available. Do not invent mechanics, rewards, or money-related claims.

Support:

- Paragraphs
- Lists
- Subheadings
- Tables
- Notices

Make article typography comfortable for long-form reading.

---

### Safety and Review Notice

Create a visually distinct but neutral notice card.

Suggested heading:

`Review and Safety Notice`

Use existing editorial wording, but improve readability.

The notice should explain that:

- Information is independently reviewed
- Status details may change
- External downloads are controlled by third-party sources
- Users should review permissions before installation
- UonoVoucher does not present unconfirmed information as official

Do not repeat the same disclaimer in several different places.

---

### Frequently Asked Questions

Add an FAQ section at the end of the main article.

Build it as a reusable accordion.

Questions should come from the current page data when available.

When no FAQ data exists, use a small set of neutral template questions that are safe for every game page, such as:

- Is this game currently available?
- Where does the download button lead?
- How often are promo codes reviewed?
- What does “unconfirmed” mean?
- How can I report outdated information?

Use FAQ structured data only when the visible FAQ content matches it exactly.

---

### Related Games

Add a reusable related-games section near the bottom.

Show 3–4 relevant games based on category or tags.

Each card should include:

- Icon
- Name
- Category
- Current status
- Promo-code availability
- Link to the game page

Do not show the current game in the related list.

---

## Sidebar

Create a clean sidebar containing some or all of the following:

### Quick Actions Card

- Download
- View promo codes
- View voucher, only when available
- Report outdated information

### Status Card

- Game status
- Promo-code status
- Last checked
- Last reviewed

### On This Page

Add anchor links for sections that exist on the page.

Example:

- Overview
- Promo Codes
- Voucher
- Game Information
- Safety Notice
- FAQs

Highlight the active section while scrolling when practical.

---

## Metadata and Editorial Information

Present publishing information in a cleaner format.

Include:

- Published date
- Last reviewed date
- Reviewer or editorial team, only if available
- Reading time, if the content supports it

Do not place dates as tiny loose text with weak hierarchy.

---

## Mobile Requirements

The page must work well from 320px upward.

On mobile:

- Stack the hero content
- Make primary buttons full width when helpful
- Keep badges wrapping cleanly
- Prevent promo-code cards from overflowing
- Keep code text readable
- Move the sidebar below the main hero or article
- Ensure copy buttons remain easy to tap
- Use appropriate spacing without excessive blank areas

---

## Accessibility

- Use semantic HTML
- Maintain logical heading order
- Add alt text to game icons
- Use visible keyboard focus states
- Ensure buttons have accessible names
- Do not rely on color alone for status
- Make accordions keyboard accessible
- Maintain sufficient contrast
- Respect reduced-motion preferences

---

## SEO and Structured Data

Implement only where supported by real page content:

- Dynamic page title
- Dynamic meta description
- Canonical URL
- Open Graph metadata
- Breadcrumb structured data
- FAQ structured data when visible FAQs exist
- Article or WebPage structured data
- Proper heading hierarchy

Do not add fake ratings, review scores, downloads, authors, or dates.

---

## Technical Requirements

- Reuse existing components where possible
- Create reusable components for the game hero, information grid, promo cards, voucher card, sidebar, FAQ, and related games
- Avoid duplicate markup
- Keep data-driven rendering
- Preserve current URLs
- Preserve existing download and copy-code behavior
- Do not introduce a large UI framework unless the project already uses it
- Avoid unnecessary dependencies
- Keep the implementation easy to maintain
- Use the project’s existing styling system
- Do not hardcode page-specific content into shared components

---

## Important Content Rules

- Do not invent promo codes, vouchers, dates, game features, or verification claims
- Do not make the page sound like an advertisement
- Do not use exaggerated phrases such as “best,” “guaranteed,” “official,” “trusted,” or “100% safe” unless supported by existing verified data
- Keep all download links clearly identified as external when applicable
- Preserve the site’s editorial and review-focused positioning

---

## Expected Visual Result

The final page should have:

- A stronger hero
- Better hierarchy
- Less unused space
- A properly proportioned promo section
- A useful desktop sidebar
- More complete editorial content
- Better mobile behavior
- Reusable components for all 56 game pages
- A polished appearance consistent with the UonoVoucher homepage

---

## Final Workflow

After implementation:

1. Run the local development server.
2. Open the Bingo 101 page.
3. Check desktop, tablet, and mobile layouts.
4. Test copy-code buttons.
5. Test download and promo navigation.
6. Confirm empty states for missing promo or voucher data.
7. Check that no existing routes are broken.
8. Run linting and the production build.
9. Fix all errors and obvious warnings.
10. Provide a summary of:
   - Files changed
   - Components created
   - Design improvements
   - Remaining content/data gaps

Proceed with the implementation. Do not stop after giving recommendations.
