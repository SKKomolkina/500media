import Link from "next/link";
import { CATEGORIES } from "@/lib/articles";
import { Wordmark } from "./Wordmark";

/** Tag space (макет: 66 px mobile/tablet, 80 px desktop). Активный тег — синий с подчёркиванием 1 px. */
export function TagSpace({ category }: { category?: string }) {
  return (
    <header className="tag-space">
      <Link href="/" className="wm wm-fixed" aria-label="500fps — на главную"><Wordmark /></Link>
      <div className="tag-space-in">
        <Link href="/" className="wm wm-inline" aria-label="500fps — на главную"><Wordmark /></Link>
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
  );
}
