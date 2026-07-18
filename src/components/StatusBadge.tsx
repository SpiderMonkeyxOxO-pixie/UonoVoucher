import { getStatusMeta } from '../utils/status';

const TONE_CLASS: Record<string, string> = {
  positive: 'badge-positive',
  caution: 'badge-caution',
  negative: 'badge-negative',
  muted: 'badge-muted',
  neutral: 'badge-neutral',
};

export function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  return <span className={`badge ${TONE_CLASS[meta.tone]}`}>{meta.label}</span>;
}
