import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceZone } from "@prismicio/react";
import { Card } from "@/components/feed/Card";
import { HeadMenu } from "@/components/article/HeadMenu";
import { BottomMenu } from "@/components/shell/BottomMenu";
import { LeftColumn } from "@/components/shell/LeftColumn";
import { getArticleDoc, getRelated } from "@/lib/articles";
import { components } from "@/slices";
import "./article.css";

type Params = Promise<{ uid: string }>;

const fmt = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uid } = await params;
  const doc = await getArticleDoc(uid);
  return { title: doc?.data.title ? `${doc.data.title} — 500fps` : "500fps" };
}

export default function ArticlePage({ params }: { params: Params }) {
  // cacheComponents: params читаются внутри <Suspense>
  return (
    <Suspense fallback={<div className="art-page" aria-busy />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Params }) {
  const { uid } = await params;
  const doc = await getArticleDoc(uid);
  if (!doc) notFound();

  const d = doc.data;
  const related = await getRelated(uid, d.category ?? null);

  return (
    <>
      <HeadMenu likes={d.likes ?? 0} reposts={d.reposts ?? 0} />
      <LeftColumn />
      <main className="art-page">
        <article className="art">
          {d.image?.url && (
            <div className="art-hero">
              <PrismicNextImage field={d.image} fill priority sizes="(min-width:768px) 712px, 100vw" className="object-cover" />
            </div>
          )}

          <div className="art-body">
            <header className="art-title">
              <h1>{d.title}</h1>
              {d.author && <p className="art-meta">Авторство: {d.author}</p>}
              <div className="art-text art-lead"><PrismicRichText field={d.lead} /></div>
            </header>

            <SliceZone slices={d.slices} components={components} />
          </div>

          <footer className="art-dates">
            <p>Дата публикации: {fmt(doc.first_publication_date)}</p>
            {doc.last_publication_date !== doc.first_publication_date && <p>Дата обновления: {fmt(doc.last_publication_date)}</p>}
          </footer>
        </article>

        {related.length > 0 && (
          <section className="related" aria-labelledby="related-h">
            <hr />
            <h2 id="related-h">Может быть интересно</h2>
            <div className="related-cards">
              {related.map((a) => (
                <div key={a.id} className="related-card"><Card article={a} size="S" /></div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomMenu active="home" />
    </>
  );
}
