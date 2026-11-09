import * as prismic from "@prismicio/client";
import { createClient } from "./prismic";
import type { FeedLike, Tier, Weight } from "./feed/types";

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
    uid: d.uid ?? d.id,
    title: (d.data.title as string) ?? "",
    tier: ((d.data.tier as Tier) ?? "basic") as Tier,
    weight: ((d.data.weight as Weight) ?? "medium") as Weight,
    image: d.data.image as prismic.ImageField,
    isVideo: Boolean(d.data.is_video),
    likes: Number(d.data.likes ?? 0),
    reposts: Number(d.data.reposts ?? 0),
    category: (d.data.category as string) ?? null,
  }));
}
