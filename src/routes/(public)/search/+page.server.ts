import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { desc, ilike, and, eq, sql, asc, gte } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') || '';
	const genre = url.searchParams.get('genre') || '';
	const status = url.searchParams.get('status') || '';
	const type = url.searchParams.get('type') || '';
	const sort = url.searchParams.get('sort') || 'latest';
	const minRating = url.searchParams.get('rating') || '';

	const conditions = [];

	if (q) conditions.push(ilike(comics.title, `%${q}%`));
	if (genre) conditions.push(ilike(comics.genres, `%${genre}%`));
	if (status && status !== 'All') conditions.push(eq(comics.status, status));
	if (type && type !== 'All') conditions.push(eq(comics.type, type));
	if (minRating) conditions.push(gte(comics.averageRating, parseFloat(minRating)));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const orderMap = {
		latest: desc(comics.updatedAt),
		oldest: asc(comics.createdAt),
		popular: desc(comics.viewCount),
		rating: desc(comics.averageRating),
		az: asc(comics.title),
		za: desc(comics.title)
	};

	const orderBy = orderMap[sort as keyof typeof orderMap] || desc(comics.updatedAt);

	const results = await db
		.select()
		.from(comics)
		.where(whereClause)
		.orderBy(orderBy)
		.limit(60);

	const totalResult = await db.select({ count: sql`count(*)` }).from(comics).where(whereClause);
	const total = Number(totalResult[0]?.count) || 0;

	return {
		results: results.map((c) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			status: c.status,
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400',
			chapter: c.status || 'N/A',
			time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
			rating: c.averageRating,
			views: c.viewCount
		})),
		total,
		filters: { q, genre, status, type, sort, minRating }
	};
};
