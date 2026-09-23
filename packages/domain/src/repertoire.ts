import type { Repertoire, RepertoireItem } from '@hymndesk/types';

/** Returns items sorted by position. */
export function getSortedItems(repertoire: Repertoire): RepertoireItem[] {
  return [...repertoire.items].sort((a, b) => a.position - b.position);
}

/** Returns a new item list with the item at fromIndex moved to toIndex. */
export function reorderItem(
  items: RepertoireItem[],
  fromIndex: number,
  toIndex: number,
): RepertoireItem[] {
  const sorted = getSortedItems({ items } as Repertoire);
  const [moved] = sorted.splice(fromIndex, 1);
  if (!moved) return items;
  sorted.splice(toIndex, 0, moved);
  return sorted.map((item, i) => ({ ...item, position: i }));
}
