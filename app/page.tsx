import Link from "next/link";
import { Feed } from "@/components/feed/Feed";
import { CATEGORIES, getArticles } from "@/lib/articles";

const PAGE = 40;

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const { cat, page } = await searchParams;
  const category = CATEGORIES.some((c) => c.id === cat) ? cat : undefined;
  const pages = Math.max(1, Number(page) || 1);

  const all = await getArticles(category);
  // Каждая «страница» — префикс одного и того же списка: показанные модули не перестраиваются.
  const items = all.slice(0, pages * PAGE);
  const hasMore = items.length < all.length;

  return (
      <>
        <header className="tag-space">
          <div className="tag-space-in">
            <Link href="/" className="wordmark" aria-label="500fps">500</Link>
            <nav className="tags" aria-label="Категории">
              <Link href="/" aria-current={!category ? "page" : undefined}>Все</Link>
              {CATEGORIES.map((c) => (
                  <Link key={c.id} href={`/?cat=${c.id}`} aria-current={category === c.id ? "page" : undefined}>
                    {c.label}
                  </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="content">
          <Feed items={items} hasMore={hasMore} />
          {hasMore && (
              <Link className="more" href={`/?${category ? `cat=${category}&` : ""}page=${pages + 1}`} scroll={false}>
                Показать ещё
              </Link>
          )}
        </main>
      </>
  );
}
