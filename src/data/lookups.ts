import { games } from './games';
import { promoCodes } from './promoCodes';
import { guides } from './guides';
import { blogPosts } from './blog';
import type { Game } from '../types';

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGameById(id: string): Game | undefined {
  return games.find((g) => g.id === id);
}

export function getPromoCodesForGame(gameId: string) {
  return promoCodes.filter((p) => p.gameId === gameId);
}

export function getPromoCodeById(id: string) {
  return promoCodes.find((p) => p.id === id);
}

export function getGuideBySlug(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((b) => b.slug === slug);
}

export function getFeaturedGames(): Game[] {
  return games.filter((g) => g.featured);
}
