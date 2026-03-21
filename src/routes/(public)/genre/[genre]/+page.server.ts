import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { ilike, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const genre = decodeURIComponent(params.genre);

	const results = await db
		.select()
		.from(comics)
		.where(ilike(comics.genres, `%${genre}%`))
		.orderBy(desc(comics.updatedAt))
		.limit(50);

	const comicList = results.map((c) => ({
		id: c.id,
		slug: c.slug,
		title: c.title,
		type: c.type,
		chapter: 'Ch. 最新',
		time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
		cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
	}));

	return { genre, comics: comicList };
};
