"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 8 15" width="8" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" style={dir === "r" ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M7 1 1.5 7.5 7 14" />
  </svg>
);
const Heart = () => <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="currentColor"><path d="M4 7.2 1 4.3A1.9 1.9 0 0 1 4 2a1.9 1.9 0 0 1 3 2.3z" /></svg>;
const Repost = () => <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4V3a1 1 0 0 1 1-1h4M7 4v1a1 1 0 0 1-1 1H2" /></svg>;

interface Props {
  title: string;
  caption: string;
  poster: React.ReactNode;
  src: string | null;
  likes: number;
  reposts: number;
  prevHref: string;
  nextHref: string;
  /** Содержимое панели: описание и «Связанные материалы» (рендерится на сервере). */
  info: React.ReactNode;
  canOpen: boolean;
}

/**
 * Вертикальный плеер 468×878. Закрытое состояние — только видео по центру.
 * Открытое — видео сдвигается влево, справа панель (desktop) / шторка снизу (mobile).
 */
export function VideoStage({ title, caption, poster, src, likes, reposts, prevHref, nextHref, info, canOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowUp" && canOpen) setOpen(true);
      if (e.key === "ArrowDown") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canOpen]);

  const toggleVideo = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  // жест «потяните вверх»
  const startY = useRef<number | null>(null);

  return (
    <div className="vstage" data-open={open}>
      <Link href={prevHref} className="vnav vnav-prev" aria-label="Предыдущее видео"><Chevron dir="l" /></Link>
      <Link href={nextHref} className="vnav vnav-next" aria-label="Следующее видео"><Chevron dir="r" /></Link>

      <div className="vwrap">
        <div
          className="video"
          onTouchStart={(e) => { startY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            if (startY.current == null) return;
            const dy = startY.current - e.changedTouches[0].clientY;
            if (dy > 60 && canOpen) setOpen(true);
            if (dy < -60) setOpen(false);
            startY.current = null;
          }}
        >
          <div className="video-media" onClick={src ? toggleVideo : undefined}>
            {poster}
            {src && (
              <video ref={ref} src={src} autoPlay muted loop playsInline preload="metadata" aria-label={title} />
            )}
            {src && paused && <span className="video-paused" aria-hidden>▶</span>}
          </div>
          <div className="video-shade" aria-hidden />

          <div className="video-ui">
            <div className="vpills">
              <button type="button" className="vpill" data-on={liked} aria-pressed={liked} aria-label="Нравится" onClick={() => setLiked((v) => !v)}>
                <Heart />{likes + (liked ? 1 : 0)}
              </button>
              <button type="button" className="vpill" data-on={reposted} aria-pressed={reposted} aria-label="Поделиться" onClick={() => setReposted((v) => !v)}>
                <Repost />{reposts + (reposted ? 1 : 0)}
              </button>
            </div>
            <div className="vtext">
              <h1>{title}</h1>
              {caption && <p>{caption}</p>}
              {canOpen && (
                <button type="button" className="vhint" aria-expanded={open} aria-controls="video-info" onClick={() => setOpen((v) => !v)}>
                  {open ? "Свернуть ↓" : "Потяните вверх, чтобы разобраться ↑"}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside id="video-info" className="vinfo" aria-hidden={!open} inert={!open}>
          <button type="button" className="vinfo-close" onClick={() => setOpen(false)} aria-label="Закрыть" />
          {info}
        </aside>
      </div>

      <button type="button" className="vdim" tabIndex={-1} aria-hidden onClick={() => setOpen(false)} />
    </div>
  );
}
