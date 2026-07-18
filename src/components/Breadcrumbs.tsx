import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {items.map((item, i) => (
          <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span className="sep">/</span>}
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
