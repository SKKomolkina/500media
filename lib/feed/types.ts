export type Tier = "basic" | "accent" | "priority";
/** Редакционная важность Basic. Система трактует её как «предпочтительный» размер. */
export type Weight = "high" | "medium" | "low";
export type Size = "S" | "M" | "L" | "A";

export interface FeedLike {
  id: string;
  tier: Tier;
  weight: Weight;
}

export interface Placed<T> {
  item: T;
  size: Size;
}
/** Колонка всегда ровно из двух карточек и всегда 500px. */
export type Column<T> = [Placed<T>, Placed<T>];

export type Block<T> =
  | { kind: "module"; columns: Column<T>[] }
  | { kind: "priority"; item: T };
