import { Suspense } from "react";
import type { Metadata } from "next";
import { VideoView } from "@/components/video/VideoView";

export const metadata: Metadata = { title: "Видео — 500fps" };

export default function VideoPage() {
  return (
    <Suspense fallback={<div className="video-page" aria-busy />}>
      <VideoView />
    </Suspense>
  );
}
