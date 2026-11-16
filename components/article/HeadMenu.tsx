"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/shell/Wordmark";
import Link from "next/link";

const Heart = () => (
  <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="currentColor"><path d="M4 7.2 1 4.3A1.9 1.9 0 0 1 4 2a1.9 1.9 0 0 1 3 2.3z" /></svg>
);
const Repost = () => (
  <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4V3a1 1 0 0 1 1-1h4M7 4v1a1 1 0 0 1-1 1H2" /></svg>
);

/**
 * Head menu статьи (80 px desktop, 64 px mobile/tablet):
 * кнопка «назад» — серая, при наведении и нажатии синяя;
 * иконки лайка и репоста серые, после действия синие (локальное состояние, без бэкенда).
 */
export function HeadMenu({ likes, reposts }: { likes: number; reposts: number }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  const back = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <header className="head-menu">
      <Link href="/" className="head-wm" aria-label="500fps — на главную"><Wordmark /></Link>
      <div className="head-in">
        <button type="button" className="back-btn" onClick={back} aria-label="Назад">
          <svg viewBox="0 0 8 15" width="8" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 1 1.5 7.5 7 14" /></svg>
        </button>
        <div className="pills">
          <button type="button" className="pill" data-on={liked} aria-pressed={liked} aria-label="Нравится" onClick={() => setLiked((v) => !v)}>
            <Heart />{likes + (liked ? 1 : 0)}
          </button>
          <button type="button" className="pill" data-on={reposted} aria-pressed={reposted} aria-label="Поделиться" onClick={() => setReposted((v) => !v)}>
            <Repost />{reposts + (reposted ? 1 : 0)}
          </button>
        </div>
      </div>
    </header>
  );
}
