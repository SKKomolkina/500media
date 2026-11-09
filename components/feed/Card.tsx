import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import type { Article } from "@/lib/articles";
import type { Size } from "@/lib/feed/types";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : String(n));

const Heart = () => (
  <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="currentColor"><path d="M4 7.2 1 4.3A1.9 1.9 0 0 1 4 2a1.9 1.9 0 0 1 3 2.3z" /></svg>
);
const Repost = () => (
  <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4V3a1 1 0 0 1 1-1h4M7 4v1a1 1 0 0 1-1 1H2" /></svg>
);
const Play = () => (
  <span className="card-play" role="img" aria-label="Видео">
    <svg viewBox="0 0 12 14" fill="currentColor"><path d="M1 1v12l10-6z" /></svg>
  </span>
);

function Media({ a }: { a: Article }) {
  return (
    <>
      {a.image?.url ? (
        <PrismicNextImage field={a.image} fill sizes="(min-width:1280px) 240px, 175px" loading="lazy" className="object-cover" />
      ) : (
        <div className="card-fallback" aria-hidden />
      )}
      {a.isVideo && <Play />}
    </>
  );
}

function Reactions({ a }: { a: Article }) {
  return (
    <div className="card-reactions">
      <span><Heart />{fmt(a.likes)}</span>
      <span><Repost />{fmt(a.reposts)}</span>
    </div>
  );
}

export function Card({ article: a, size }: { article: Article; size: Size }) {
  const href = `/${a.uid}`;
  if (size === "A") {
    return (
      <Link href={href} className="card card-accent">
        <Media a={a} />
        <div className="card-text card-text-over">
          <h3 className="card-title">{a.title}</h3>
          <Reactions a={a} />
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className={`card card-basic card-${size.toLowerCase()}`}>
      <div className="card-media"><Media a={a} /></div>
      <div className="card-text">
        <h3 className="card-title">{a.title}</h3>
        <Reactions a={a} />
      </div>
    </Link>
  );
}

export function PriorityCard({ article: a }: { article: Article }) {
  return (
    <Link href={`/${a.uid}`} className="card card-priority">
      <Media a={a} />
      <div className="card-priority-body">
        <h2 className="card-priority-title">{a.title}</h2>
        <span className="card-priority-btn">Смотреть</span>
      </div>
    </Link>
  );
}
