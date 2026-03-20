import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { desc, ilike, and, eq, sql } from 'drizzle-orm';

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

	const pageParam = url.searchParams.get('page') || '1';
	const page = parseInt(pageParam) > 0 ? parseInt(pageParam) : 1;
	const pageSize = 24;

	// Query Populer (Top 6 berdasarkan Views) Hanya ketika tidak sedang search/filter dan di page 1
	let popularComics: any[] = [];
	if (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1) {
		const popularQuery = await db
			.select()
			.from(comics)
			.orderBy(desc(comics.viewCount))
			.limit(6);
			
		popularComics = popularQuery.map((c) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			chapter: '🔥 HOT',
			time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
		}));
	}

	// Query Total Data Untuk Hitung Pagination
	let totalRecords = 0;
	if (whereClause) {
		const countResult = await db.select({ count: sql`count(*)` }).from(comics).where(whereClause);
		totalRecords = Number(countResult[0]?.count) || 0;
	} else {
		const countResult = await db.select({ count: sql`count(*)` }).from(comics);
		totalRecords = Number(countResult[0]?.count) || 0;
	}
	const totalPages = Math.ceil(totalRecords / pageSize);

	// Query data Latest Updates
	const allComics = await db
		.select()
		.from(comics)
		.where(whereClause)
		.orderBy(desc(comics.updatedAt))
		.limit(searchQuery ? 100 : pageSize)
		.offset(searchQuery ? 0 : (page - 1) * pageSize);

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
		popularComics,
		searchQuery,
		typeFilter: typeFilter || 'All',
		currentPage: page,
		totalPages
	};
};
