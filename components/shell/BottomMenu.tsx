import Link from "next/link";

type Active = "home" | "about" | "video";

const Home = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" /></svg>
);
const Info = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2zm0-8h-2V7h2z" /></svg>
);
const Video = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden><path d="M3 6h12a2 2 0 0 1 2 2v2.5L22 7v10l-5-3.5V16a2 2 0 0 1-2 2H3z" /></svg>
);

/** Нижнее меню: mobile и tablet (189×51, белая «таблетка», активный пункт синий). На desktop скрыто. */
export function BottomMenu({ active }: { active: Active }) {
  const items: { id: Active; href: string; label: string; icon: React.ReactNode }[] = [
    { id: "home", href: "/", label: "Главная", icon: <Home /> },
    { id: "about", href: "/about", label: "О нас", icon: <Info /> },
    { id: "video", href: "/video", label: "Видео", icon: <Video /> },
  ];
  return (
    <nav className="bottom-menu" aria-label="Разделы">
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <Link href={it.href} aria-label={it.label} aria-current={active === it.id ? "page" : undefined}>
              {it.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
