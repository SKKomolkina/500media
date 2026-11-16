// Заполняет Prismic тестовыми статьями (type: article) для проверки ленты.
//
//   PRISMIC_WRITE_TOKEN=xxxx node scripts/seed.mjs            # показать план, ничего не писать
//   PRISMIC_WRITE_TOKEN=xxxx node scripts/seed.mjs --apply    # создать и опубликовать
//
// Все документы получают тег "seed" и uid вида seed-1…seed-36 — их легко найти и удалить.
import { readFileSync } from "node:fs";
import { createWriteClient, createMigration } from "@prismicio/client";

const apply = process.argv.includes("--apply");
const publish = !process.argv.includes("--no-publish");
const { repositoryName } = JSON.parse(readFileSync(new URL("../prismic.config.json", import.meta.url), "utf8"));
const writeToken = process.env.PRISMIC_WRITE_TOKEN;

const TITLES = [
  "Новая видеокарта вдвое быстрее прошлого поколения в тестах",
  "Топ-10 игр, которых мы ждём в этом году",
  "Нейросеть научилась рисовать карты для настольных игр",
  "Обзор игрового ноутбука: мощный, но шумный и очень горячий при долгой нагрузке в играх",
  "Что нового в обновлении драйверов",
  "Как собрать ПК за 80 тысяч",
  "Релиз, которого мы не ожидали",
  "ИИ в играх: помощник или замена сценаристу?",
  "Тест SSD: PCIe 5.0 действительно нужен?",
  "Инди-хит недели",
  "Монитор с частотой 480 Гц: есть ли смысл",
  "Локальные языковые модели на домашнем железе",
  "Главный материал: итоги года в индустрии",
  "Разбор патча: что изменилось в балансе",
  "Охлаждение процессора: башня или СЖО",
  "Нейросети для озвучки игр",
  "Рейтинг лучших клавиатур",
  "Игры, которые стоит пройти в выходные",
  "Видеокарты: что покупать осенью",
  "Как ИИ меняет разработку игр",
];
const CATS = ["hardware", "games", "ai"];
const WEIGHTS = ["high", "medium", "low", "medium", "low", "high", "medium", "low", "high"];
const ACCENT = new Set([4, 9, 17, 22, 30]);
const PRIORITY = new Set([13, 26]);
const TOTAL = 36;

const docs = Array.from({ length: TOTAL }, (_, k) => {
  const i = k + 1;
  const tier = PRIORITY.has(i) ? "priority" : ACCENT.has(i) ? "accent" : "basic";
  return {
    i,
    uid: `seed-${i}`,
    title: TITLES[k % TITLES.length],
    tier,
    weight: WEIGHTS[k % WEIGHTS.length],
    category: CATS[i % 3],
    is_video: i % 6 === 0,
    likes: [12, 340, 1250, 87, 2100, 560][k % 6],
    reposts: [3, 41, 180, 9, 330, 75][k % 6],
  };
});

console.log(`Репозиторий: ${repositoryName}`);
console.table(docs.map(({ i, tier, weight, category, is_video }) => ({ i, tier, weight: tier === "basic" ? weight : "-", category, video: is_video })));
const count = (f) => docs.filter(f).length;
console.log(`basic ${count((d) => d.tier === "basic")}, accent ${count((d) => d.tier === "accent")}, priority ${count((d) => d.tier === "priority")}`);

if (!apply) {
  console.log("\nДемо-режим. Для записи добавьте --apply");
  process.exit(0);
}
if (!writeToken) {
  console.error("\nНе задан PRISMIC_WRITE_TOKEN (Settings → API & Security → Write APIs).");
  process.exit(1);
}

const client = createWriteClient(repositoryName, { writeToken });

const existing = await client.getAllByTag("seed").catch(() => []);
if (existing.length) {
  console.error(`\nВ репозитории уже есть ${existing.length} документов с тегом "seed". Удалите их и запустите снова.`);
  process.exit(1);
}

const repo = await client.getRepository();
const lang = repo.languages[0].id; // основной язык репозитория
console.log(`\nЯзык документов: ${lang}`);

const migration = createMigration();
for (const d of docs) {
  const image = migration.createAsset(`https://picsum.photos/seed/500fps-${d.i}/800/1000.jpg`, `seed-${d.i}.jpg`, {
    alt: d.title,
    tags: ["seed"],
  });
  migration.createDocument(
    {
      type: "article",
      uid: d.uid,
      lang,
      tags: ["seed"],
      data: {
        title: d.title,
        tier: d.tier,
        weight: d.weight,
        pinned: false,
        position: d.i,
        category: d.category,
        image,
        is_video: d.is_video,
        likes: d.likes,
        reposts: d.reposts,
      },
    },
    `seed-${d.i}`,
  );
}

await client.migrate(migration, {
  reporter: (e) => {
    if (e.type === "end") console.log(e.data ?? "");
    else if (e.data?.current != null) process.stdout.write(`\r${e.type}: ${e.data.current}/${e.data.remaining + e.data.current}   `);
  },
});
console.log("\nДокументы созданы в релизе миграции.");

if (publish) {
  const res = await client.publishMigrationRelease();
  console.log(`Опубликовано: ${res.totalItems ?? "?"}`);
} else {
  console.log("Опубликуйте релиз миграции в интерфейсе Prismic.");
}
