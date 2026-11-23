import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { getVideos } from "@/lib/articles";
import { BottomMenu } from "@/components/shell/BottomMenu";
import { LeftColumn } from "@/components/shell/LeftColumn";
import { TagSpace } from "@/components/shell/TagSpace";
import { VideoStage } from "./VideoStage";
import "./video.css";

/** Страница ленты видео: /video (первое видео) и /video/[uid]. */
export async function VideoView({ uid }: { uid?: string }) {
  const videos = await getVideos();
  if (videos.length === 0) notFound();

  const i = uid ? videos.findIndex((v) => v.uid === uid) : 0;
  if (i < 0) notFound();

  const v = videos[i];
  const prev = videos[(i - 1 + videos.length) % videos.length];
  const next = videos[(i + 1) % videos.length];
  const hasSummary = v.summary.length > 0 || v.related.length > 0;

  return (
    <>
      <div className="video-bg" aria-hidden>
        {v.image?.url && <PrismicNextImage field={v.image} fill sizes="100vw" className="object-cover" />}
      </div>
      <TagSpace />
      <LeftColumn />
      <main className="video-page">
        <VideoStage
          title={v.title}
          caption={v.caption}
          src={v.videoUrl}
          likes={v.likes}
          reposts={v.reposts}
          prevHref={`/video/${prev.uid}`}
          nextHref={`/video/${next.uid}`}
          canOpen={hasSummary}
          poster={v.image?.url ? <PrismicNextImage field={v.image} fill priority sizes="468px" className="object-cover" /> : <div className="video-ph" />}
          info={
            <div className="vinfo-in">
              {v.summary.length > 0 && <div className="vinfo-text"><PrismicRichText field={v.summary} /></div>}
              {v.related.length > 0 && (
                <section aria-labelledby="vrel-h">
                  <h2 id="vrel-h">Связанные материалы</h2>
                  <ul>
                    {v.related.map((r) => (
                      <li key={r.uid}><Link href={`/${r.uid}`}>{r.title} →</Link></li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          }
        />
      </main>
      <BottomMenu active="video" />
    </>
  );
}
