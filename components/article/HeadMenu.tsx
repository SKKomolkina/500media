"use client";

import { useRouter } from "next/navigation";
import { useReaction } from "@/lib/reactions/client";
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
export function HeadMenu({ uid, likes, reposts }: { uid: string; likes: number; reposts: number }) {
  const router = useRouter();
  const like = useReaction(uid, "likes", likes);
  const repost = useReaction(uid, "reposts", reposts);

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
          <button type="button" className="pill" data-on={like.on} aria-pressed={like.on} aria-label="Нравится" onClick={like.toggle}>
            <Heart />{like.count}
          </button>
          <button type="button" className="pill" data-on={repost.on} aria-pressed={repost.on} aria-label="Поделиться" onClick={repost.toggle}>
            <Repost />{repost.count}
          </button>
        </div>
      </div>
    </header>
  );
}
