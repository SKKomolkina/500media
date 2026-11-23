import {Suspense} from "react";
import Link from "next/link";
import {Feed} from "@/components/feed/Feed";
import {BottomMenu} from "@/components/shell/BottomMenu";
import {LeftColumn} from "@/components/shell/LeftColumn";
import {TagSpace} from "@/components/shell/TagSpace";
import {CATEGORIES, getArticles} from "@/lib/articles";

const PAGE = 40;

type SP = Promise<{ cat?: string; page?: string }>;

// cacheComponents: runtime-данные (searchParams) читаются только внутри <Suspense>
export default function Home({searchParams}: { searchParams: SP }) {
    return (
        <Suspense fallback={<div className="content" aria-busy/>}>
            <HomeContent searchParams={searchParams}/>
        </Suspense>
    );
}

async function HomeContent({searchParams}: { searchParams: SP }) {
    const {cat, page} = await searchParams;
    const category = CATEGORIES.some((c) => c.id === cat) ? cat : undefined;
    const pages = Math.max(1, Number(page) || 1);

    const all = await getArticles(category);
    // Каждая «страница» — префикс одного и того же списка: показанные модули не перестраиваются.
    const items = all.slice(0, pages * PAGE);
    const hasMore = items.length < all.length;

    return (
        <>
            <TagSpace category={category}/>
            <LeftColumn/>
            <main className="content">
                <Feed items={items} hasMore={hasMore}/>
                {hasMore && (
                    <Link className="more" href={`/?${category ? `cat=${category}&` : ""}page=${pages + 1}`}
                          scroll={false}>
                        Показать ещё
                    </Link>
                )}
            </main>
            <BottomMenu active="home"/>
        </>
    );
}
