import type { Hymn, Verse, VerseType } from '@hymndesk/types';

/** Returns all verses in display order (verses, then chorus interleaved per repeat config). */
export function getVerseSequence(hymn: Hymn, repeatChorus: boolean = true): Verse[] {
  const verses = hymn.verses.filter((v) => v.type === 'VERSE');
  const chorus = hymn.chorus;

  if (!chorus || !repeatChorus) return hymn.verses;

  const result: Verse[] = [];
  for (const verse of verses) {
    result.push(verse);
    result.push({ index: -1, lyrics: chorus.lyrics, type: chorus.type as VerseType });
  }
  return result;
}

/** Returns the full text of a hymn for search indexing. */
export function getHymnFullText(hymn: Hymn): string {
  const parts: string[] = [hymn.title];
  if (hymn.title_alt) parts.push(hymn.title_alt);
  for (const verse of hymn.verses) {
    parts.push(verse.lyrics.join(' '));
  }
  if (hymn.chorus) {
    parts.push(hymn.chorus.lyrics.join(' '));
  }
  return parts.join(' ');
}

/** Returns true if a hymn has audio content available. */
export function hymnHasAudio(hymn: Hymn): boolean {
  return hymn.audio_refs.length > 0;
}

/** Returns true if a hymn has video content available. */
export function hymnHasVideo(hymn: Hymn): boolean {
  return hymn.video_refs.length > 0;
}

/** Returns true if solfa notation is available for a hymn. */
export function hymnHasSolfa(hymn: Hymn): boolean {
  return hymn.solfa != null && hymn.solfa.parts.length > 0;
}
