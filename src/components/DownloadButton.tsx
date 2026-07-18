interface DownloadButtonProps {
  url?: string;
  gameName: string;
  className?: string;
  small?: boolean;
}

export function DownloadButton({ url, gameName, className, small }: DownloadButtonProps) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary ${small ? 'btn-sm' : ''} ${className ?? ''}`}
      aria-label={`Download ${gameName} (opens in a new tab)`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2v7.5M8 9.5l3-3M8 9.5l-3-3M3 12.5h10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Download
    </a>
  );
}
