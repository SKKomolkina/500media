import { connection } from "next/server";
import { bump, getAll, type Kind } from "@/lib/reactions/store";

const UID = /^[a-zA-Z0-9_-]{1,100}$/;

/** GET /api/reactions → { [uid]: { likes, reposts } } — живые приращения к значениям из Prismic. */
export async function GET() {
  await connection(); // всегда динамический ответ, не кэшируется при сборке
  return Response.json(await getAll(), { headers: { "Cache-Control": "no-store" } });
}

/** POST { uid, kind: "likes" | "reposts", delta: 1 | -1 } → новые значения этой статьи. */
export async function POST(request: Request) {
  await connection();
  let body: { uid?: unknown; kind?: unknown; delta?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const { uid, kind, delta } = body;
  if (typeof uid !== "string" || !UID.test(uid)) return Response.json({ error: "bad uid" }, { status: 400 });
  if (kind !== "likes" && kind !== "reposts") return Response.json({ error: "bad kind" }, { status: 400 });
  if (delta !== 1 && delta !== -1) return Response.json({ error: "bad delta" }, { status: 400 });

  const counts = await bump(uid, kind as Kind, delta);
  return Response.json(counts, { headers: { "Cache-Control": "no-store" } });
}
