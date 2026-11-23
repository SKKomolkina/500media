import { Suspense } from "react";
import type { Metadata } from "next";
import { VideoView } from "@/components/video/VideoView";

export const metadata: Metadata = { title: "Видео — 500fps" };

type Params = Promise<{ uid: string }>;

export default function VideoByUid({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="video-page" aria-busy />}>
      <Inner params={params} />
    </Suspense>
  );
}

async function Inner({ params }: { params: Params }) {
  const { uid } = await params;
  return <VideoView uid={uid} />;
}
