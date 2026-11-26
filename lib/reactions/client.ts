"use client";

import { useSyncExternalStore } from "react";

type Counts = { likes: number; reposts: number };
export type Kind = keyof Counts;

/**
 * Клиентское хранилище: живые приращения (с сервера) + «мои» лайки/репосты (localStorage).
 * Итог на экране = значение из Prismic + приращение с сервера.
 */
let live: Record<string, Counts> = {};
let mine = new Set<string>();
let loaded = false;
let loading = false;
const listeners = new Set<() => void>();
const MINE_KEY = "500fps:reactions";
let version = 0;
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

function readMine() {
  try {
    mine = new Set(JSON.parse(localStorage.getItem(MINE_KEY) ?? "[]") as string[]);
  } catch {
    mine = new Set();
  }
}

async function load() {
  if (loaded || loading) return;
  loading = true;
  readMine();
  try {
    const res = await fetch("/api/reactions", { cache: "no-store" });
    if (res.ok) live = (await res.json()) as Record<string, Counts>;
  } catch {
    /* сервер недоступен — остаются значения из Prismic */
  }
  loaded = true;
  loading = false;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  void load();
  return () => listeners.delete(cb);
}

// Снимок = номер версии; меняется только в emit(), поэтому ссылка стабильна между рендерами.
const getVersion = () => version;

export function useReaction(uid: string, kind: Kind, base: number) {
  useSyncExternalStore(subscribe, getVersion, () => 0);
  const on = mine.has(`${uid}:${kind}`);
  const count = base + (live[uid]?.[kind] ?? 0);

  const toggle = async () => {
    const key = `${uid}:${kind}`;
    const delta = mine.has(key) ? -1 : 1;
    // оптимистично
    if (delta === 1) mine.add(key);
    else mine.delete(key);
    live = { ...live, [uid]: { ...(live[uid] ?? { likes: 0, reposts: 0 }), [kind]: Math.max(0, (live[uid]?.[kind] ?? 0) + delta) } };
    try {
      localStorage.setItem(MINE_KEY, JSON.stringify([...mine]));
    } catch {
      /* private mode */
    }
    emit();
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, kind, delta }),
      });
      if (res.ok) {
        const c = (await res.json()) as Counts;
        live = { ...live, [uid]: c };
        emit();
      }
    } catch {
      /* офлайн: оставляем оптимистичное значение до перезагрузки */
    }
  };

  return { count, on, toggle };
}

export const fmtCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : String(n));
