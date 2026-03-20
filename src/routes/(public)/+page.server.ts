import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { desc, ilike, and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const searchQuery = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type') || '';

	const conditions = [];

	if (searchQuery) {
		conditions.push(ilike(comics.title, `%${searchQuery}%`));
	}

	if (typeFilter && typeFilter !== 'All') {
		conditions.push(eq(comics.type, typeFilter));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// Query data langsung dari Database secara Native SQL menggunakan Filter Dinamis
	const allComics = await db
		.select()
		.from(comics)
		.where(whereClause)
		.orderBy(desc(comics.updatedAt))
		.limit(searchQuery ? 100 : 24); // Show limits

	const latestUpdates = allComics.map((c) => ({
		id: c.id,
		slug: c.slug,
		title: c.title,
		type: c.type,
		chapter: 'Ch. 最新', // Mockup state presentasi sementara (nantinya bisa di join)
		time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
		cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
	}));

	return {
		latestUpdates,
		searchQuery,
		typeFilter: typeFilter || 'All'
	};
};
