import type { Metadata } from "next";
import { BottomMenu } from "@/components/shell/BottomMenu";
import { LeftColumn } from "@/components/shell/LeftColumn";
import { TagSpace } from "@/components/shell/TagSpace";
import { Wordmark } from "@/components/shell/Wordmark";

export const metadata: Metadata = { title: "О нас — 500fps" };

export default function About() {
  return (
    <>
      <TagSpace />
      <LeftColumn />
      <main className="about">
        <Wordmark className="about-wm" />
        <p>500fps — медиа о технологиях, компьютерном железе и устройствах. Мы следим за новостями индустрии, тестируем технику и разбираемся в том, как она устроена и работает на практике.</p>
        <p>Здесь выходят статьи, видео, новости и подробные разборы для тех, кому интересно не только узнать о новом продукте, но и понять, чем он отличается от предыдущего поколения, кому подойдёт и стоит ли вообще обращать на него внимание.</p>
        <p>Мы стараемся говорить о технологиях понятно, не упрощая их до набора рекламных обещаний.</p>
      </main>
      <BottomMenu active="about" />
    </>
  );
}
