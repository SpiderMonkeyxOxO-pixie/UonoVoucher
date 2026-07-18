export function estimateReadingTime(paragraphs: string[][]): string {
  const wordCount = paragraphs.flat().reduce((total, p) => total + p.split(/\s+/).filter(Boolean).length, 0);
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}
