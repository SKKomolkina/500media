import Link from "next/link";

const DOCS = [
  "Политика конфиденциальности",
  "Политика использования cookie",
  "Настройки cookie",
  "Правила размещения партнёрских материалов",
];
const SOCIALS = [
  { id: "rt", label: "RUTUBE", href: "#" },
  { id: "tt", label: "TikTok", href: "#" },
  { id: "vk", label: "VK", href: "#" },
];

/** Левая колонка desktop (288 px): описание сверху, соцсети и документы снизу. Не участвует в ленте. */
export function LeftColumn() {
  return (
    <aside className="left-col">
      <div className="left-desc">
        <p>500fps — Медиа о компьютерном железе, играх и технологиях. Новости, статьи, видео и разборы в одной ленте.</p>
        <Link href="/about">Подробнее, кто мы →</Link>
      </div>
      <div className="left-info">
        <div className="left-social">
          <p>Мы в социальных сетях</p>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.id}><a href={s.href} aria-label={s.label}>{s.label.slice(0, 2)}</a></li>
            ))}
          </ul>
        </div>
        <hr />
        <ul className="left-docs">
          {DOCS.map((d) => (
            <li key={d}><a href="#">{d}</a></li>
          ))}
        </ul>
        <small>© 2026 500fps</small>
      </div>
    </aside>
  );
}
