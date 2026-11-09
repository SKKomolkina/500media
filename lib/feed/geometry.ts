/**
 * Геометрия из макета 500.fig (02. Cards rules / 04. Layout).
 *
 * Mobile / Tablet (колонка 175, gap 8):
 *   текстовая зона = 8 + 28 (заголовок 14/14 × 2) + 8 + 14 (реакции) + 8 = 66
 *   медиа: S 120 · M 180 · L 240   →  S 186 · M 246 · L 306
 *   S+L = 186 + 8 + 306 = 500 = M+M = 246 + 8 + 246;  Accent = L = 306
 *
 * Desktop (колонка 224 при контенте 1200, gap 20):
 *   текстовая зона = 10 + 36 (заголовок 18/18 × 2) + 8 + 14 + 10 = 78
 *   медиа масштабируется на k = ширина колонки / 175 (S 154 · M 230 · L 307 при 224),
 *   текстовая зона фиксирована → равенство S+L = M+M сохраняется при любом k.
 */
export const BASE_COL_W = 175;
export const MEDIA = { S: 120, M: 180, L: 240 } as const; // база для 175px
export const TEXT = { mobile: 66, desktop: 78 } as const;
export const GAP = { mobile: 8, desktop: 20 } as const;

export const CARD_H = { S: 186, M: 246, L: 306, A: 306 } as const; // mobile/tablet
export const COLUMN_H = 500;

export const PRIORITY = {
  mobile: { w: 358, h: 306, title: 24 },
  tablet: { w: 724, h: 306, title: 24 },
  desktop: { w: 1200, h: 426, title: 32 },
} as const;

export const BREAKPOINTS = { mobile: 2, tablet: 4, desktop: 5 } as const;
export type Layout = keyof typeof BREAKPOINTS;
