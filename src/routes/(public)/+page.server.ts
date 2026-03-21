import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, announcements, history, chapters, ads } from '$lib/server/schema';
import { desc, ilike, and, eq, sql, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, locals }) => {
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
	let popularComics: {
		id: number;
		slug: string;
		title: string;
		type: string;
		chapter: string;
		time: string;
		cover: string;
	}[] = [];
	if (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1) {
		const popularQuery = await db.execute(sql`
			SELECT c.*, COUNT(v.id) as recent_views
			FROM comics c
			LEFT JOIN comic_views v ON c.id = v.comic_id AND v.created_at >= NOW() - INTERVAL '7 days'
			GROUP BY c.id
			ORDER BY recent_views DESC, c.view_count DESC
			LIMIT 6
		`);
			
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		popularComics = (popularQuery.rows || popularQuery).map((c: any) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			chapter: '🔥 HOT',
			time: new Date(c.updated_at || Date.now()).toLocaleDateString(),
			cover: c.cover_url || 'https://picsum.photos/seed/placeholder/300/400'
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

	// Join latest chapter number per comic
	const comicIds = allComics.map((c) => c.id);
	const latestChapterMap = new Map<number, string>();
	if (comicIds.length > 0) {
		const latestChapters = await db.execute(sql`
			SELECT DISTINCT ON (comic_id) comic_id, chapter_number
			FROM chapters
			WHERE comic_id = ANY(${comicIds})
			ORDER BY comic_id, created_at DESC
		`);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(latestChapters.rows || latestChapters).forEach((r: any) => {
			latestChapterMap.set(r.comic_id, r.chapter_number);
		});
	}

	const latestUpdates = allComics.map((c) => ({
		id: c.id,
		slug: c.slug,
		title: c.title,
		type: c.type,
		chapter: latestChapterMap.has(c.id) ? `Ch. ${latestChapterMap.get(c.id)}` : 'Belum ada chapter',
		time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
		cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
	}));

	// Query Featured Comics (Slider Pilihan Editor)
	let featuredComics: {
		id: number;
		slug: string;
		title: string;
		author: string | null;
		description: string | null;
		cover: string;
	}[] = [];
	if (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1) {
		const featured = await db
			.select()
			.from(comics)
			.where(eq(comics.isFeatured, true))
			.orderBy(desc(comics.updatedAt))
			.limit(5);
		featuredComics = featured.map((c) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			author: c.author,
			description: c.description,
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/800/400'
		}));
	}

	// Query Announcements Aktif (Banner)
	const activeAnnouncements = await db
		.select()
		.from(announcements)
		.where(eq(announcements.isActive, true))
		.orderBy(asc(announcements.sortOrder));

	// Query Continue Reading (hanya untuk user yang login)
	let continueReading: {
		comicId: number;
		slug: string;
		title: string;
		cover: string;
		chapterNumber: string;
		readAt: Date;
	}[] = [];
	const user = locals.user;
	if (user && (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1)) {
		const historyRecords = await db
			.select({
				comicId: history.comicId,
				chapterId: history.chapterId,
				readAt: history.readAt,
				slug: comics.slug,
				title: comics.title,
				cover: comics.coverUrl,
				chapterNumber: chapters.chapterNumber
			})
			.from(history)
			.innerJoin(comics, eq(history.comicId, comics.id))
			.innerJoin(chapters, eq(history.chapterId, chapters.id))
			.where(eq(history.userId, user.id))
			.orderBy(desc(history.readAt))
			.limit(6);

		continueReading = historyRecords.map((h) => ({
			comicId: h.comicId,
			slug: h.slug,
			title: h.title,
			cover: h.cover || 'https://picsum.photos/seed/placeholder/300/400',
			chapterNumber: h.chapterNumber,
			readAt: h.readAt
		}));
	}

	// Query Active Ads
	const activeAds = await db.select().from(ads).where(eq(ads.isActive, true));

	return {
		latestUpdates,
		popularComics,
		featuredComics,
		activeAnnouncements,
		continueReading,
		activeAds,
		searchQuery,
		typeFilter: typeFilter || 'All',
		currentPage: page,
		totalPages
	};
};
