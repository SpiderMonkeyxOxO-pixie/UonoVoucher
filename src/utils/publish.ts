/**
 * Date gating for scheduled posts. A post is live from 07:00 IST on its
 * `publishedAt` date. Older posts (all dated well in the past) are unaffected.
 * Keep in sync with isPublished() in scripts/generate-sitemap.js.
 */
export function isPublished(publishedAt: string, now: Date = new Date()): boolean {
  const goLive = Date.parse(`${publishedAt}T07:00:00+05:30`);
  if (Number.isNaN(goLive)) return true;
  return now.getTime() >= goLive;
}
