"use client";

import { fmtCount, useReaction, type Kind } from "@/lib/reactions/client";

/** Число лайков/репостов на карточке: значение из Prismic + живое приращение. Только чтение. */
export function LiveCount({ uid, kind, base }: { uid: string; kind: Kind; base: number }) {
  const { count } = useReaction(uid, kind, base);
  return <>{fmtCount(count)}</>;
}
