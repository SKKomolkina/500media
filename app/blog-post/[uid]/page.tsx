import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { cacheTagPrismicPages, getPreviewRef } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params }: PageProps<"/blog-post/[uid]">) {
	const { uid } = await params;
	const page = await getPage(uid, await getPreviewRef());

	return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateStaticParams() {
	const client = createClient();
	const pages = await client.getAllByType("blog_post");

	return pages.map((page) => ({ uid: page.uid }));
}

async function getPage(uid: string, ref?: string) {
	"use cache";
	cacheLife("max");
	const client = createClient();
	const page = await client.getByUID("blog_post", uid, { ref }).catch(() => notFound());
	cacheTagPrismicPages([page]);
	return page;
}