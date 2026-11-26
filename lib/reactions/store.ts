import "server-only";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * ТЕСТОВОЕ хранилище счётчиков: JSON-файл `.data/reactions.json` на сервере.
 * Работает локально и на одном постоянном сервере. На serverless-хостинге (Vercel)
 * файловая система временная — для продакшена заменить на Redis/Postgres,
 * сохранив сигнатуры `getAll` и `bump`.
 */
export type Counts = { likes: number; reposts: number };
export type Kind = keyof Counts;

// На Vercel проект доступен только для чтения — пишем во временную папку (данные не постоянные).
const DIR = process.env.VERCEL ? path.join(os.tmpdir(), "500fps") : path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "reactions.json");
let memory: Record<string, Counts> | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Record<string, Counts>> {
  if (memory) return memory;
  try {
    memory = JSON.parse(await fs.readFile(FILE, "utf8")) as Record<string, Counts>;
  } catch {
    memory = {};
  }
  return memory;
}

export async function getAll(): Promise<Record<string, Counts>> {
  return { ...(await load()) };
}

/** Изменяет счётчик на ±1 (не ниже нуля). Записи выстраиваются в очередь, чтобы не затирать друг друга. */
export function bump(uid: string, kind: Kind, delta: 1 | -1): Promise<Counts> {
  const run = async () => {
    const data = await load();
    const cur = data[uid] ?? { likes: 0, reposts: 0 };
    const next = { ...cur, [kind]: Math.max(0, cur[kind] + delta) };
    data[uid] = next;
    try {
      await fs.mkdir(DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(data, null, 2));
    } catch {
      /* диск недоступен — счётчик остаётся в памяти процесса */
    }
    return next;
  };
  const p = queue.then(run, run);
  queue = p.catch(() => undefined);
  return p;
}
