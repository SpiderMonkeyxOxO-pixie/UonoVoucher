export type GameCategory = 'slots' | 'skill' | 'multiplayer' | 'fight-flight' | 'fishing';

export type CodeStatus = 'checked' | 'reported' | 'unconfirmed' | 'expired' | 'none';

export type PromoCodeStatus = 'checked' | 'reported' | 'unconfirmed' | 'expired' | 'withdrawn' | 'scheduled';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface GameFaq {
  question: string;
  answer: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  category: GameCategory;
  image: string;
  summary: string;
  /** Short article-style body for the game's own page — a few short paragraphs, not the card blurb. */
  description: string[];
  /** How this game's format/genre generally works — not researched claims about the specific app. */
  formatNotes: string[];
  /** Notes on external access — download link is off-site, review permissions, etc. */
  accessNotes: string[];
  /** Data-grounded explanation of this game's actual promo-code record. */
  promoExplanation: string[];
  /** Data-grounded review observations (built from real status/date fields, not invented facts). */
  reviewNotes: string[];
  /** Safety/permissions notice text — shares a consistent core statement across games. */
  safetyNotes: string[];
  faqs: GameFaq[];
  metaTitle: string;
  metaDescription: string;
  publishedAt?: string;
  reviewedAt: string;
  codeStatus: CodeStatus;
  featured?: boolean;
  /** Placeholder destination only — not a verified store listing. See Editorial Policy. */
  downloadUrl?: string;
  /** Manual pin position for listing order (1 = shown first). Unset games sort after all pinned ones. */
  sortOrder?: number;
}

export interface PromoCode {
  id: string;
  gameId: string;
  code: string;
  status: PromoCodeStatus;
  addedAt: string;
  checkedAt?: string;
  expiresAt?: string;
  eligibility?: string;
  sourceNote?: string;
  /** Which daily release slot this code belongs to. Defaults to 'morning' when absent. */
  timeSlot?: TimeSlot;
}

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** SEO title tag, if different from the on-page title. Falls back to `title`. */
  metaTitle?: string;
  /** SEO meta description, if different from the excerpt. Falls back to `excerpt`. */
  metaDescription?: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  /** Featured image shown on the blog card and at the top of the article. */
  image?: string;
  /** Legacy plain-paragraph body, used when `content` is absent. */
  body?: string[];
  /** Rich, structured body (headings/paragraphs/lists/tables) for longer editorial articles. */
  content?: BlogBlock[];
  faqs?: GameFaq[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  /** SEO title tag, if different from the on-page title. Falls back to `title`. */
  metaTitle?: string;
  /** SEO meta description, if different from the summary. Falls back to `summary`. */
  metaDescription?: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  /** Featured image shown on the guide card and at the top of the guide. */
  image?: string;
  /** Legacy plain-paragraph body, used when `content` is absent. */
  body?: string[];
  /** Rich, structured body (headings/paragraphs/lists/tables) for longer guides. */
  content?: BlogBlock[];
  faqs?: GameFaq[];
}
