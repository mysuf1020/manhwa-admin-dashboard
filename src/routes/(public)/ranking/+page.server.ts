import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { desc, eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const typeFilter = url.searchParams.get('type') || 'All';
	const metric = url.searchParams.get('metric') || 'views'; // 'views' or 'rating'
	
	const conditions = [];
	if (typeFilter !== 'All') {
		conditions.push(eq(comics.type, typeFilter));
	}
	
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const orderBy = metric === 'rating' ? desc(comics.averageRating) : desc(comics.viewCount);

	const topComics = await db
		.select()
		.from(comics)
		.where(whereClause)
		.orderBy(orderBy)
		.limit(50); // Get top 50

	return {
		topComics: topComics.map((c) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			status: c.status,
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400',
			rating: c.averageRating,
			views: c.viewCount,
			genres: c.genres,
		})),
		typeFilter,
		metric
	};
};
