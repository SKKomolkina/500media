import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
	const secret = process.env.PRISMIC_WEBHOOK_SECRET;
	if (secret) {
		const body = (await request.json().catch(() => ({}))) as { secret?: string };
		if (body.secret !== secret) {
			return NextResponse.json({ revalidated: false }, { status: 401 });
		}
	}

	revalidateTag("prismic", { expire: 0 });
	return NextResponse.json({ revalidated: true, now: Date.now() });
}
