import * as prismic from "@prismicio/client";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/prismicio";
import type { FeedLike } from "./feed/types";

export const CATEGORIES = [
  { id: "hardware", label: "Железо" },
  { id: "games", label: "Игры" },
  { id: "ai", label: "ИИ" },
] as const;

export interface Article extends FeedLike {
  uid: string;
  title: string;
  image: prismic.ImageField;
  isVideo: boolean;
  likes: number;
  reposts: number;
  category: string | null;
}

export async function getArticles(category?: string): Promise<Article[]> {
  // cacheComponents: клиент Prismic читает Date.now(), поэтому запрос кэшируем.
  // Тег "prismic" сбрасывается из /api/revalidate при публикации в Prismic.
  "use cache";
  cacheLife("minutes");
  cacheTag("prismic");

  const client = createClient();
  const docs = await client.getAllByType("article", {
    filters: category ? [prismic.filter.at("my.article.category", category)] : [],
    // Редакционный порядок: закреплённые → ручная позиция → свежесть. Без random.
    orderings: [
      { field: "my.article.pinned", direction: "desc" },
      { field: "my.article.position" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  return docs.map((d) => ({
    id: d.id,
    uid: d.uid,
    title: d.data.title ?? "",
    tier: d.data.tier ?? "basic",
    weight: d.data.weight ?? "medium",
    image: d.data.image,
    isVideo: d.data.is_video,
    likes: d.data.likes ?? 0,
    reposts: d.data.reposts ?? 0,
    category: d.data.category ?? null,
  }));
}

/** Полный документ для страницы материала (кэшируется, тег prismic). */
export async function getArticleDoc(uid: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("prismic");

  const client = createClient();
  return client.getByUID("article", uid).catch(() => null);
}

/** «Может быть интересно»: до 3 материалов Basic из той же категории (иначе из общей ленты). */
export async function getRelated(uid: string, category: string | null): Promise<Article[]> {
  const all = await getArticles();
  const basics = all.filter((a) => a.uid !== uid && a.tier === "basic");
  const same = category ? basics.filter((a) => a.category === category) : [];
  return [...same, ...basics.filter((a) => !same.includes(a))].slice(0, 3);
}

export interface VideoItem {
  uid: string;
  title: string;
  caption: string;
  image: prismic.ImageField;
  videoUrl: string | null;
  summary: prismic.RichTextField;
  likes: number;
  reposts: number;
  related: { uid: string; title: string }[];
}

/** Лента видео: материалы с флагом is_video, в редакционном порядке (кэшируется). */
export async function getVideos(): Promise<VideoItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("prismic");

  const client = createClient();
  const docs = await client.getAllByType("article", {
    filters: [prismic.filter.at("my.article.is_video", true)],
    fetchLinks: ["article.title"],
    orderings: [
      { field: "my.article.pinned", direction: "desc" },
      { field: "my.article.position" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  return docs.map((d) => {
    const v = d.data.video as { link_type?: string; url?: string } | undefined;
    return {
      uid: d.uid,
      title: d.data.title ?? "",
      caption: prismic.asText(d.data.lead) ?? "",
      image: d.data.image,
      videoUrl: v?.link_type === "Media" && v.url ? v.url : null,
      summary: d.data.summary ?? [],
      likes: d.data.likes ?? 0,
      reposts: d.data.reposts ?? 0,
      related: (d.data.related ?? []).flatMap((r) => {
        const l = r.article as unknown as { uid?: string; data?: { title?: string } };
        return l?.uid ? [{ uid: l.uid, title: l.data?.title ?? l.uid }] : [];
      }),
    };
  });
}
