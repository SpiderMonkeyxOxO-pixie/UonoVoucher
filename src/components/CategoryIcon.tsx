import type { GameCategory } from '../types';

const ICONS: Record<GameCategory, React.ReactNode> = {
  slots: (
    <>
      <rect x="4" y="6" width="20" height="16" rx="4" />
      <path d="M9 12v4M14 10v8M19 12v4" strokeLinecap="round" />
    </>
  ),
  skill: (
    <>
      <path d="M8 4l4 3-1.4 4.8L14 15l-1.4 4.8L8 23" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="15" y="6" width="8" height="12" rx="2" />
    </>
  ),
  multiplayer: (
    <>
      <circle cx="10" cy="10" r="3.4" />
      <circle cx="19" cy="13" r="2.8" />
      <path d="M4 21c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" strokeLinecap="round" fill="none" />
      <path d="M16.5 21c0-2.5 1.9-4.3 4.5-4.3" strokeLinecap="round" fill="none" />
    </>
  ),
  'fight-flight': (
    <>
      <path d="M14 4l7 7-4 1.5-1.5 4L9 9l1.5-1.5L14 4z" strokeLinejoin="round" />
      <path d="M4 22l5-5" strokeLinecap="round" />
      <path d="M9 22v-4h-4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  fishing: (
    <>
      <path
        d="M3 13c4-5 10-6 14-2-4 4-10 3-14-2z"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
      <path d="M17 11l4-3M17 13l4 3" strokeLinecap="round" />
    </>
  ),
};

export function CategoryIcon({ category, size = 24 }: { category: GameCategory; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {ICONS[category]}
    </svg>
  );
}
