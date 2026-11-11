import * as prismic from "@prismicio/client";
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
