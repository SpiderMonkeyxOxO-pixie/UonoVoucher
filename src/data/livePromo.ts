import { useSyncExternalStore } from 'react';
import { games } from './games';
import { getGameById } from './lookups';
import type { PromoCode, TimeSlot } from '../types';

/**
 * Live promo codes, managed from code.uonovoucher.com and served as
 * /promo-live.json. The site is a prerendered SPA whose built-in promo data is
 * fixed at build time, so the daily Morning / Afternoon / Evening codes are
 * fetched in the browser and merged over it. A missing or malformed file just
 * means "no live codes" — the built-in records are shown unchanged.
 */

export type LiveSlots = Partial<Record<TimeSlot, string>>;

export interface LiveOverlay {
  /** YYYY-MM-DD the codes were last saved for (IST). */
  date: string;
  updatedAt: string;
  /** game slug -> codes */
  codes: Record<string, LiveSlots>;
}

/** A promo entry that may carry up to three live per-slot codes. */
export type EffectivePromo = PromoCode & { slots?: LiveSlots };

const SLOT_ORDER: TimeSlot[] = ['morning', 'afternoon', 'evening'];

let overlay: LiveOverlay | null = null;
let started = false;
const listeners = new Set<() => void>();

function isOverlay(v: unknown): v is LiveOverlay {
  if (!v || typeof v !== 'object') return false;
  const o = v as Partial<LiveOverlay>;
  return typeof o.date === 'string' && !!o.codes && typeof o.codes === 'object';
}

/** Starts the one-time fetch. Safe to call repeatedly; call it as early as possible. */
export function startLivePromo(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  // The build-time prerender drives a real browser (Playwright); it must snapshot the
  // neutral built-in data, never whatever codes happen to be live during a rebuild.
  if (navigator.webdriver) return;
  fetch('/promo-live.json', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((json: unknown) => {
      if (!isOverlay(json)) return;
      overlay = json;
      listeners.forEach((l) => l());
    })
    .catch(() => {
      /* no live file — built-in data stays */
    });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  startLivePromo();
  return () => {
    listeners.delete(cb);
  };
}

export function useLiveOverlay(): LiveOverlay | null {
  return useSyncExternalStore(subscribe, () => overlay, () => null);
}

const cleanSlots = (s: LiveSlots | undefined): LiveSlots => {
  const out: LiveSlots = {};
  if (!s) return out;
  for (const slot of SLOT_ORDER) {
    const v = typeof s[slot] === 'string' ? s[slot]!.trim() : '';
    if (v) out[slot] = v;
  }
  return out;
};

/**
 * Overlays live codes on the built-in entries. A game with live codes gets its
 * entry replaced (status "reported", checked on the overlay date); games without
 * live codes are untouched. Games that have codes live but no built-in entry get
 * one synthesised. Games with live codes sort first.
 */
export function applyLive(base: PromoCode[], live: LiveOverlay | null): EffectivePromo[] {
  if (!live) return base;
  const bySlug = new Map(games.map((g) => [g.slug, g] as const));
  const seen = new Set<string>();
  const merged: EffectivePromo[] = base.map((entry) => {
    const game = getGameById(entry.gameId);
    const slots = game ? cleanSlots(live.codes[game.slug]) : {};
    const first = SLOT_ORDER.find((s) => slots[s]);
    if (!game || !first) return entry;
    seen.add(game.slug);
    return {
      ...entry,
      code: slots[first]!,
      status: 'reported',
      checkedAt: live.date,
      timeSlot: first,
      slots,
    };
  });

  for (const [slug, raw] of Object.entries(live.codes)) {
    const game = bySlug.get(slug);
    const slots = cleanSlots(raw);
    const first = SLOT_ORDER.find((s) => slots[s]);
    if (!game || !first || seen.has(slug)) continue;
    merged.push({
      id: `promo-live-${slug}`,
      gameId: game.id,
      code: slots[first]!,
      status: 'reported',
      addedAt: live.date,
      checkedAt: live.date,
      timeSlot: first,
      slots,
    });
  }

  const hasLive = (e: EffectivePromo) => (e.slots ? 0 : 1);
  return [...merged].sort((a, b) => hasLive(a) - hasLive(b));
}
