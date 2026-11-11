import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
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
  // getAll + фильтр по типу: работает, пока prismicio-types.d.ts не знает тип article
  const docs = await client.dangerouslyGetAll({
    filters: [
      prismic.filter.at("document.type", "article"),
      ...(category ? [prismic.filter.at("my.article.category", category)] : []),
    ],
    // Редакционный порядок: закреплённые → ручная позиция → свежесть. Без random.
    orderings: [
      { field: "my.article.pinned", direction: "desc" },
      { field: "my.article.position" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  return docs.map((d) => {
    const data = d.data as Record<string, unknown>;
    return {
      id: d.id,
      uid: d.uid ?? d.id,
      title: (data.title as string) ?? "",
      tier: ((data.tier as Tier) ?? "basic") as Tier,
      weight: ((data.weight as Weight) ?? "medium") as Weight,
      image: data.image as prismic.ImageField,
      isVideo: Boolean(data.is_video),
      likes: Number(data.likes ?? 0),
      reposts: Number(data.reposts ?? 0),
      category: (data.category as string) ?? null,
    };
  });
}
