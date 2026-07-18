import type { GameCategory } from '../types';

export interface CategoryMeta {
  id: GameCategory;
  label: string;
  tagline: string;
}

export const categories: CategoryMeta[] = [
  { id: 'slots', label: 'Slots', tagline: 'Reel and spin formats' },
  { id: 'skill', label: 'Skill', tagline: 'Card and skill formats' },
  { id: 'multiplayer', label: 'Multiplayer', tagline: 'Social and table formats' },
  { id: 'fight-flight', label: 'Fight / Flight', tagline: 'Arcade and action formats' },
  { id: 'fishing', label: 'Fishing', tagline: 'Fish-table formats' },
];
