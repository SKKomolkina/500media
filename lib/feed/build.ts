import type { Block, Column, FeedLike, Placed, Size } from "./types";

/** Сколько ближайших материалов просматривается при подборе пары. */
const WINDOW = 6;

export interface BuildOptions {
  /** Количество колонок в модуле: 2 / 4 / 5 */
  columns: number;
  /**
   * false — данные могут быть подгружены позже: строим только то, что не изменится
   *         после добавления новых материалов (префикс-стабильность).
   * true  — данных больше нет: допускается неполный завершающий модуль
   *         и размещение оставшихся Priority в конце.
   */
  final?: boolean;
}

interface Node<T> {
  item: T;
  idx: number;
}

/**
 * Детерминированная сборка ленты. Без random и без зависимости от времени:
 * одинаковые данные + columns → одинаковый результат.
 *
 *  1. Priority выносятся из потока и запоминают «якорь» — число материалов
 *     потока, стоявших перед ними в редакционном порядке.
 *  2. Из потока (Basic + Accent) собираются колонки по 500px:
 *       S+L | L+S | S+A | A+S | M+M
 *  3. `columns` колонок = модуль. Модуль завершается на общей линии.
 *  4. После модуля, если все материалы до якоря уже израсходованы, ставится Priority.
 *  5. Accent/Priority не меняют уровень; Basic свободно меняют размер и порядок.
 */
export function buildFeed<T extends FeedLike>(items: T[], opts: BuildOptions): Block<T>[] {
  const { columns: cols, final = false } = opts;

  const flow: Node<T>[] = [];
  const priorities: { item: T; anchor: number }[] = [];
  for (const item of items) {
    if (item.tier === "priority") priorities.push({ item, anchor: flow.length });
    else flow.push({ item, idx: flow.length });
  }

  const used: boolean[] = flow.map(() => false);
  const blocks: Block<T>[] = [];
  let cursor = 0; // первый неиспользованный индекс
  let p = 0; // следующий Priority
  let colCounter = 0; // для стабильного чередования L+S / S+L

  const advance = () => {
    while (cursor < flow.length && used[cursor]) cursor++;
  };
  const remaining = () => {
    let n = 0;
    for (let i = cursor; i < flow.length; i++) if (!used[i]) n++;
    return n;
  };

  /** Priority можно ставить, только если всё, что стояло перед ним, уже в ленте. */
  const flushPriority = () => {
    advance();
    if (p < priorities.length && priorities[p].anchor <= cursor) {
      blocks.push({ kind: "priority", item: priorities[p].item });
      p++;
    }
  };

  /** Собирает одну колонку и помечает использованные. null — собрать нельзя. */
  const buildColumn = (): Column<T> | null => {
    advance();
    if (cursor >= flow.length) return null;

    const first = cursor;
    const window: number[] = [];
    const rest: number[] = [];
    for (let i = first + 1; i < flow.length; i++) {
      if (used[i]) continue;
      rest.push(i);
      if (window.length < WINDOW) window.push(i);
    }

    const isBasic = (n: Node<T>) => n.item.tier === "basic";
    const f = flow[first];
    const flip = colCounter % 2 === 1;

    // Партнёр: предпочтительный вес в окне → любой Basic в окне → любой Basic дальше.
    const find = (weight: FeedLike["weight"]): number | undefined =>
      window.find((i) => isBasic(flow[i]) && flow[i].item.weight === weight) ??
      window.find((i) => isBasic(flow[i])) ??
      rest.find((i) => isBasic(flow[i]));

    const commit = (pi: number, sizes: [Size, Size], keepOrder: boolean): Column<T> => {
      const a: Placed<T> = { item: f.item, size: sizes[0] };
      const b: Placed<T> = { item: flow[pi].item, size: sizes[1] };
      used[first] = true;
      used[pi] = true;
      colCounter++;
      return keepOrder || !flip ? [a, b] : [b, a];
    };

    if (f.item.tier === "accent") {
      const pi = find("low");
      return pi === undefined ? null : commit(pi, ["A", "S"], false);
    }

    const w = f.item.weight;
    const pi = find(w === "high" ? "low" : w === "medium" ? "medium" : "high");
    if (pi === undefined) return null;
    if (w === "medium") return commit(pi, ["M", "M"], true);
    return commit(pi, w === "high" ? ["L", "S"] : ["S", "L"], false);
  };

  flushPriority();

  for (;;) {
    // Не строим модуль, пока не уверены, что подгрузка не изменит его состав.
    if (!final && remaining() < cols * 2 + WINDOW) break;

    const snapshot = used.slice();
    const counterSnapshot = colCounter;
    const cs: Column<T>[] = [];
    for (let c = 0; c < cols; c++) {
      const col = buildColumn();
      if (!col) break;
      cs.push(col);
    }

    if (cs.length === cols || (final && cs.length > 0)) {
      blocks.push({ kind: "module", columns: cs });
      flushPriority();
      if (cs.length < cols) break;
    } else {
      // откат: неполный модуль не показываем
      used.splice(0, used.length, ...snapshot);
      colCounter = counterSnapshot;
      break;
    }
  }

  // Данных больше нет — оставшиеся Priority встают после последнего завершённого модуля.
  if (final) {
    while (p < priorities.length) blocks.push({ kind: "priority", item: priorities[p++].item });
  }

  return blocks;
}
