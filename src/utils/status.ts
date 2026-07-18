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

export function getStatusMeta(status: string): StatusMeta {
  return STATUS_META[status] ?? { label: status, tone: 'neutral' };
}

export function isDisabledStatus(status: string): boolean {
  return status === 'expired' || status === 'withdrawn' || status === 'none';
}
