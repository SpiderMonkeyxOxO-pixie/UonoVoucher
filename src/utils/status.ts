export type StatusTone = 'positive' | 'neutral' | 'caution' | 'negative' | 'muted';

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

const STATUS_META: Record<string, StatusMeta> = {
  checked: { label: 'Checked', tone: 'positive' },
  active: { label: 'Active', tone: 'positive' },
  scheduled: { label: 'Scheduled', tone: 'neutral' },
  limited: { label: 'Limited', tone: 'caution' },
  reported: { label: 'Reported', tone: 'caution' },
  unconfirmed: { label: 'Unconfirmed', tone: 'muted' },
  expired: { label: 'Expired', tone: 'negative' },
  withdrawn: { label: 'Withdrawn', tone: 'negative' },
  none: { label: 'No code on record', tone: 'muted' },
};

/**
 * "Checked"/"Reported"/"Active"/"Limited" all claim a verification that's current.
 * Once the record's own last-checked/last-reviewed date is older than this, that
 * claim is no longer true. The record itself keeps its real (old) date — this only
 * changes the badge, which falls back to "Unconfirmed" instead of silently going on
 * claiming freshness it doesn't have.
 */
const STALE_AFTER_DAYS = 30;
const CLAIMS_CURRENT_VERIFICATION: ReadonlySet<string> = new Set(['checked', 'reported', 'active', 'limited']);

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return 0;
  return (Date.now() - then) / 86_400_000;
}

export function getStatusMeta(status: string, lastVerifiedAt?: string): StatusMeta {
  const base = STATUS_META[status] ?? { label: status, tone: 'neutral' };
  if (lastVerifiedAt && CLAIMS_CURRENT_VERIFICATION.has(status) && daysSince(lastVerifiedAt) > STALE_AFTER_DAYS) {
    return STATUS_META.unconfirmed;
  }
  return base;
}

export function isDisabledStatus(status: string): boolean {
  return status === 'expired' || status === 'withdrawn' || status === 'none' || status === 'scheduled';
}
