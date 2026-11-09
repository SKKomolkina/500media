import { buildFeed } from "@/lib/feed/build";
import { BREAKPOINTS, type Layout } from "@/lib/feed/geometry";
import type { Block } from "@/lib/feed/types";
import type { Article } from "@/lib/articles";
import { Card, PriorityCard } from "./Card";

function Blocks({ blocks, layout }: { blocks: Block<Article>[]; layout: Layout }) {
  return (
    <div className={`feed feed-${layout}`}>
      {blocks.map((b, i) =>
        b.kind === "priority" ? (
          <PriorityCard key={`p-${b.item.id}`} article={b.item} />
        ) : (
          <div key={`m-${i}-${b.columns[0][0].item.id}`} className="module" style={{ ["--cols" as string]: b.columns.length }}>
            {b.columns.map((col, c) => (
              <div key={c} className="column">
                {col.map((p) => (
                  <Card key={p.item.id} article={p.item} size={p.size} />
                ))}
              </div>
            ))}
          </div>
        ),
      )}
    </div>
  );
}

/**
 * Лента пересобирается под каждый брейкпоинт с нуля (координаты не переносятся).
 * Три раскладки рендерятся на сервере, CSS показывает нужную — без гидрационных скачков.
 * Скрытые раскладки не грузят изображения (loading="lazy" + display:none).
 */
export function Feed({ items, hasMore }: { items: Article[]; hasMore: boolean }) {
  const final = !hasMore;
  return (
    <>
      {(Object.keys(BREAKPOINTS) as Layout[]).map((layout) => (
        <Blocks key={layout} layout={layout} blocks={buildFeed(items, { columns: BREAKPOINTS[layout], final })} />
      ))}
    </>
  );
}
