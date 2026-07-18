import { useState } from 'react';
import { useToast } from '../hooks/useToast';

interface CopyButtonProps {
  code: string;
  disabled?: boolean;
  className?: string;
}

export function CopyButton({ code, disabled, className }: CopyButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    showToast(`Code "${code}" copied to clipboard`);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${disabled ? 'btn-secondary' : 'btn-primary'} ${className ?? ''}`}
      onClick={handleCopy}
      disabled={disabled}
      aria-label={disabled ? `${code} is no longer available to copy` : `Copy code ${code}`}
    >
      {copied && !disabled && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {disabled ? 'Unavailable' : copied ? 'Copied' : 'Copy code'}
    </button>
  );
}
