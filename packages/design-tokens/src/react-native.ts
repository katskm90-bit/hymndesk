// HymnDesk design tokens for React Native
// Platform applications import these values rather than hardcoding colours.

export const colors = {
  light: {
    bg:           '#ffffff',
    bg2:          '#f8fafc',
    bg3:          '#f1f5f9',
    card:         '#ffffff',
    border:       '#e2e8f0',
    border2:      '#cbd5e1',
    text:         '#1e293b',
    text2:        '#475569',
    text3:        '#64748b',
    text4:        '#94a3b8',
    orange:       '#E8650A',
    orangeDark:   '#C05A08',
    orangeHover:  '#d45a08',
    orangeTint:   '#FFF0E6',
    orangeTint2:  '#FFD9B8',
    destructive:  '#dc2626',
    destructiveBg:'#fef2f2',
  },
  dark: {
    bg:           '#1a1a1a',
    bg2:          '#242424',
    bg3:          '#2e2e2e',
    card:         '#242424',
    border:       '#383838',
    border2:      '#505050',
    text:         '#f0f0f0',
    text2:        '#c0c0c0',
    text3:        '#909090',
    text4:        '#606060',
    orange:       '#E8650A',
    orangeDark:   '#C05A08',
    orangeHover:  '#d45a08',
    orangeTint:   '#2a1506',
    orangeTint2:  '#3d2010',
    destructive:  '#ef4444',
    destructiveBg:'#2a0808',
  },
} as const;

export const fonts = {
  display: 'PlayfairDisplay-Bold',
  body:    'Inter',
  mono:    'JetBrainsMono',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radius = {
  sm:   6,
  md:   9,
  lg:   13,
  xl:   16,
  xxl:  18,
  full: 9999,
} as const;

export const typography = {
  xs:    { fontSize: 11, lineHeight: 16 },
  sm:    { fontSize: 12, lineHeight: 18 },
  base:  { fontSize: 14, lineHeight: 20 },
  md:    { fontSize: 15, lineHeight: 22 },
  lg:    { fontSize: 17, lineHeight: 24 },
  xl:    { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 26, lineHeight: 34 },
  '3xl': { fontSize: 32, lineHeight: 40 },
} as const;
