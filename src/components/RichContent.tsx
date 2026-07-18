import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { BlogBlock } from '../types';

const INLINE_RE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;

  while ((match = INLINE_RE.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      const label = match[2];
      const href = match[3];
      nodes.push(
        href.startsWith('/') ? (
          <Link key={`${keyPrefix}-${i++}`} to={href}>
            {label}
          </Link>
        ) : (
          <a key={`${keyPrefix}-${i++}`} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ),
      );
    }
    lastIndex = INLINE_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderBlock(block: BlogBlock, i: number) {
  switch (block.type) {
    case 'heading': {
      const id = slugifyHeading(block.text);
      return block.level === 2 ? (
        <h2 key={i} id={id}>{renderInline(block.text, `h2-${i}`)}</h2>
      ) : (
        <h3 key={i} id={id}>{renderInline(block.text, `h3-${i}`)}</h3>
      );
    }
    case 'paragraph':
      return <p key={i}>{renderInline(block.text, `p-${i}`)}</p>;
    case 'code':
      return (
        <pre key={i}>
          <code>{block.text}</code>
        </pre>
      );
    case 'list': {
      const items = block.items.map((item, j) => <li key={j}>{renderInline(item, `li-${i}-${j}`)}</li>);
      return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
    }
    case 'quote':
      return <blockquote key={i}>{renderInline(block.text, `q-${i}`)}</blockquote>;
    case 'table':
      return (
        <div className="table-scroll" key={i}>
          <table>
            <thead>
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{renderInline(cell, `td-${i}-${r}-${c}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function RichContent({ content }: { content: BlogBlock[] }) {
  return <>{content.map((block, i) => renderBlock(block, i))}</>;
}
