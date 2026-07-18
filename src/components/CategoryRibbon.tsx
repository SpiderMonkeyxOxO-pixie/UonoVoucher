import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import type { GameCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import './CategoryRibbon.css';

interface CategoryRibbonProps {
  activeCategory?: GameCategory | null;
  basePath?: string;
}

export function CategoryRibbon({ activeCategory = null, basePath = '/uono-games/' }: CategoryRibbonProps) {
  return (
    <div className="category-ribbon">
      <div className="container">
        <nav className="category-ribbon-inner" aria-label="Game categories">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`${basePath}?category=${cat.id}`}
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              aria-current={activeCategory === cat.id ? 'true' : undefined}
            >
              <span className="category-icon-wrap">
                <CategoryIcon category={cat.id} />
              </span>
              <span className="category-text">
                <strong>{cat.label}</strong>
                <span>{cat.tagline}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
