/**
 * Normalises a string for search comparison.
 * Strips diacritics, lowercases, collapses whitespace.
 * Matches the normalisation applied in the hymn search_normalized field.
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns true if haystack contains all terms in needle after normalisation. */
export function matchesSearch(haystack: string, needle: string): boolean {
  const normalHaystack = normalizeForSearch(haystack);
  const terms = normalizeForSearch(needle).split(' ').filter(Boolean);
  return terms.every((term) => normalHaystack.includes(term));
}
