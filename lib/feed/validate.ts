import { CARD_H, COLUMN_H, GAP } from "./geometry";
import type { Block } from "./types";

/** Инвариант: каждая колонка = 500px. Вызывать в dev/тестах. */
export function assertBalanced<T>(blocks: Block<T>[]) {
  for (const b of blocks) {
    if (b.kind !== "module") continue;
    for (const [x, y] of b.columns) {
      const h = CARD_H[x.size] + GAP.mobile + CARD_H[y.size];
      if (h !== COLUMN_H) throw new Error(`Column height ${h} ≠ ${COLUMN_H}: ${x.size}+${y.size}`);
    }
  }
}
