// HymnDesk shared TypeScript types
// All platform applications and packages import from here.
// Do not add runtime code to this package.

// ── Hymn content ──────────────────────────────────────────────────────────────

export type HymnStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED' | 'RETIRED';
export type VerseType = 'VERSE' | 'CHORUS' | 'REFRAIN' | 'BRIDGE' | 'INTRO' | 'OUTRO';
export type MediaType = 'AUDIO' | 'VIDEO';
export type TextDirection = 'LTR' | 'RTL';

export interface MediaRef {
  type: MediaType;
  url: string;
  label?: string;
  duration_sec?: number;
}

export interface Verse {
  index: number;
  lyrics: string[];
  type: VerseType;
}

export interface Chorus {
  lyrics: string[];
  type: 'CHORUS' | 'REFRAIN';
}

export interface SolfaContent {
  parts: SolfaPart[];
  key?: string;
  time_signature?: string;
}

export interface SolfaPart {
  voice: string;
  bars: SolfaBar[];
}

export interface SolfaBar {
  beats: string[];
}

export interface Hymn {
  id: string;
  book_id: string;
  language_id: string;
  hymn_number: string;
  title: string;
  title_alt?: string;
  verses: Verse[];
  chorus?: Chorus;
  solfa?: SolfaContent;
  composer?: string;
  author?: string;
  translator?: string;
  arrangement?: string;
  copyright?: string;
  audio_refs: MediaRef[];
  video_refs: MediaRef[];
  source_info?: string;
  created_at: string;
  updated_at: string;
  content_version: number;
  published_version: number;
  status: HymnStatus;
  deleted: boolean;
  search_normalized: string;
}

export interface HymnBook {
  id: string;
  code: string;
  name: string;
  language_id: string;
  publisher?: string;
  year?: number;
  status: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  direction: TextDirection;
}

// ── User / auth ────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'worship_leader' | 'content_contributor' | 'content_editor' | 'content_reviewer' | 'platform_administrator';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  user: UserProfile;
}

// ── Repertoire ─────────────────────────────────────────────────────────────────

export type RepertoireItemType = 'HYMN' | 'SEGMENT' | 'ANNOUNCEMENT' | 'CUSTOM';

export interface RepertoireItem {
  id: string;
  repertoire_id: string;
  item_type: RepertoireItemType;
  hymn_id?: string;
  custom_title?: string;
  custom_note?: string;
  position: number;
  key_signature?: string;
  tempo?: number;
  repeat_config?: RepeatConfig;
  created_at: string;
  updated_at: string;
}

export interface RepeatConfig {
  sections: RepeatSection[];
}

export interface RepeatSection {
  label: string;
  type: VerseType;
  count: number;
}

export interface Repertoire {
  id: string;
  user_id: string;
  name: string;
  items: RepertoireItem[];
  created_at: string;
  updated_at: string;
  is_shared: boolean;
  share_token?: string;
}

// ── Service plan ───────────────────────────────────────────────────────────────

export interface ServicePlan {
  id: string;
  user_id: string;
  title: string;
  date?: string;
  repertoire_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ── Sync ────────────────────────────────────────────────────────────────────────

export type SyncStatus = 'IDLE' | 'SYNCING' | 'ERROR' | 'OFFLINE';

export interface PendingWrite {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: unknown;
  created_at: string;
  retry_count: number;
  last_error?: string;
}

// ── Projection ─────────────────────────────────────────────────────────────────

export type ConnectionState = 'READY' | 'CONNECTING' | 'DISCONNECTED';
export type ProjectionBackground = 'black' | 'navy' | 'purple' | 'vignette' | 'carbon';

export interface PresentationSession {
  id: string;
  current_item?: HymnRef | CustomSlide;
  previous_item?: HymnRef | CustomSlide;
  next_item?: HymnRef | CustomSlide;
  current_verse: number;
  selected_language_id?: string;
  theme: ProjectionTheme;
  display_assignment?: string;
  blank: boolean;
  blackout: boolean;
  operator_notes?: string;
  stage_notes?: string;
  connection_state: ConnectionState;
  last_updated: string;
}

export interface HymnRef {
  type: 'HYMN';
  hymn_id: string;
  hymn_number: string;
  title: string;
}

export interface CustomSlide {
  type: 'CUSTOM';
  title: string;
  body?: string;
}

export interface ProjectionTheme {
  background: ProjectionBackground;
  font_size_scale: number;
}

// ── Search ─────────────────────────────────────────────────────────────────────

export interface SearchQuery {
  text?: string;
  hymn_number?: string;
  book_id?: string;
  language_id?: string;
  favourites_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  hymns: HymnSearchHit[];
  total: number;
  query_ms: number;
}

export interface HymnSearchHit {
  hymn: Hymn;
  score: number;
  match_type: 'NUMBER' | 'TITLE' | 'LYRICS' | 'RECENT' | 'FAVOURITE';
}
