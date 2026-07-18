const ICONS: Record<string, React.ReactNode> = {
  'how-to-check-if-a-uono-voucher-has-expired': (
    <>
      <circle cx="9" cy="9" r="6.5" />
      <path d="M9 5.5V9l2.6 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'why-a-promo-code-may-not-work': (
    <>
      <path d="M6.5 6.7a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1.9-1.1 1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="9" cy="13.2" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'review-app-permissions-before-installation': (
    <>
      <path d="M9 2.5l5.5 2v4.2c0 3.4-2.3 5.9-5.5 6.8-3.2-.9-5.5-3.4-5.5-6.8V4.5L9 2.5z" strokeLinejoin="round" />
      <path d="M6.3 9l1.8 1.8L11.7 7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'how-we-assign-status-labels': (
    <>
      <path d="M9.5 2.5H14a1 1 0 0 1 1 1v4.5a1 1 0 0 1-.3.7L8.4 15a1 1 0 0 1-1.4 0L3.3 11.3a1 1 0 0 1 0-1.4L9.5 3.2z" strokeLinejoin="round" />
      <circle cx="11.5" cy="5.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'what-to-do-when-reports-conflict': (
    <>
      <path d="M5 4.5v6a2 2 0 0 0 2 2h1.5M5 4.5L3 6.5M5 4.5l2 2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13 13.5v-6a2 2 0 0 0-2-2H9.5M13 13.5l2-2M13 13.5l-2-2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  'understanding-voucher-eligibility-notes': (
    <>
      <path d="M5 2.5h6l2.5 2.5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      <path d="M6 8.5h6M6 11.5h4" strokeLinecap="round" />
    </>
  ),
};

const FALLBACK = (
  <path d="M4 9.5l3.5 3.5L14 5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
);

export function GuideIcon({ slug, size = 20 }: { slug: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      {ICONS[slug] ?? FALLBACK}
    </svg>
  );
}
