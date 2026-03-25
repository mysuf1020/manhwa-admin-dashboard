import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, announcements, history, chapters, ads, followers } from '$lib/server/schema';
import { desc, ilike, and, eq, sql, asc, inArray, notInArray, or } from 'drizzle-orm';

function timeAgo(date: Date | string | null): string {
	const now = Date.now();
	const d = date ? new Date(date).getTime() : now;
	const diff = now - d;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return 'Baru saja';
	if (mins < 60) return `${mins} menit lalu`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} jam lalu`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} hari lalu`;
	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks} minggu lalu`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months} bulan lalu`;
	return `${Math.floor(months / 12)} tahun lalu`;
}

export const load: PageServerLoad = async ({ url, locals }) => {
	const searchQuery = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type') || '';
	const genreFilter = url.searchParams.get('genre') || '';

	const conditions = [];

	if (searchQuery) {
		conditions.push(ilike(comics.title, `%${searchQuery}%`));
	}

	if (typeFilter && typeFilter !== 'All') {
		conditions.push(eq(comics.type, typeFilter));
	}

	if (genreFilter) {
		conditions.push(ilike(comics.genres, `%${genreFilter}%`));
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
			time: timeAgo(c.updated_at),
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

	// Join latest chapters per comic (up to 5 each)
	const comicIds = allComics.map((c) => c.id);
	const chaptersMap = new Map<number, { number: string; time: string }[]>();
	if (comicIds.length > 0) {
		const chaptersQuery = await db
			.select({ comicId: chapters.comicId, chapterNumber: chapters.chapterNumber, createdAt: chapters.createdAt })
			.from(chapters)
			.where(inArray(chapters.comicId, comicIds))
			.orderBy(desc(chapters.createdAt));
		
		for (const row of chaptersQuery) {
			const list = chaptersMap.get(row.comicId) || [];
			if (list.length < 5) {
				list.push({ number: row.chapterNumber, time: timeAgo(row.createdAt) });
				chaptersMap.set(row.comicId, list);
			}
		}
	}

	const latestUpdates = allComics.map((c) => {
		const chList = chaptersMap.get(c.id) || [];
		return {
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			chapter: chList.length > 0 ? `Ch. ${chList[0].number}` : 'Belum ada chapter',
			chapters: chList,
			time: timeAgo(c.updatedAt),
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
		};
	});

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

	// Query Update Komik Diikuti (hanya untuk user yang login)
	let followedUpdates: {
		comicId: number;
		slug: string;
		title: string;
		cover: string;
		chapterNumber: string;
		chapterTitle: string | null;
	}[] = [];
	if (user && (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1)) {
		const userFollows = await db.select({ comicId: followers.comicId }).from(followers).where(eq(followers.userId, user.id));
		if (userFollows.length > 0) {
			const followedIds = userFollows.map(f => f.comicId);
			const updates = await db.select({
				comicId: comics.id,
				slug: comics.slug,
				title: comics.title,
				cover: comics.coverUrl,
				chapterNumber: chapters.chapterNumber,
				chapterTitle: chapters.title
			})
			.from(chapters)
			.innerJoin(comics, eq(chapters.comicId, comics.id))
			.where(inArray(comics.id, followedIds))
			.orderBy(desc(chapters.createdAt))
			.limit(10);

			followedUpdates = updates.map(u => ({
				comicId: u.comicId,
				slug: u.slug,
				title: u.title,
				cover: u.cover || 'https://picsum.photos/seed/placeholder/300/400',
				chapterNumber: u.chapterNumber,
				chapterTitle: u.chapterTitle
			}));
		}
	}

	// Query "Untukmu" (Rekomendasi Cerdas berdasarkan history)
	let forYouComics: {
		id: number;
		slug: string;
		title: string;
		type: string;
		chapter: string;
		time: string;
		cover: string;
	}[] = [];

	if (user && (!searchQuery && (!typeFilter || typeFilter === 'All') && page === 1)) {
		const readComicRecords = await db.select({ comicId: history.comicId }).from(history).where(eq(history.userId, user.id));
		const readComicIds = readComicRecords.map(h => h.comicId);

		const historyGenres = await db.select({ genres: comics.genres })
			.from(history)
			.innerJoin(comics, eq(history.comicId, comics.id))
			.where(eq(history.userId, user.id))
			.orderBy(desc(history.readAt))
			.limit(50);
		
		const genreCounts: Record<string, number> = {};
		for (const row of historyGenres) {
			if (row.genres) {
				const genresStr = row.genres.split(',').map(g => g.trim()).filter(Boolean);
				for (const g of genresStr) {
					genreCounts[g] = (genreCounts[g] || 0) + 1;
				}
			}
		}

		const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);

		if (topGenres.length > 0) {
			const genreConditions = topGenres.map(g => ilike(comics.genres, `%${g}%`));
			
			const recommendations = await db.select()
				.from(comics)
				.where(
					and(
						or(...genreConditions),
						readComicIds.length > 0 ? notInArray(comics.id, readComicIds) : undefined
					)
				)
				.orderBy(desc(comics.viewCount))
				.limit(6);
			
			forYouComics = recommendations.map(c => ({
				id: c.id,
				slug: c.slug,
				title: c.title,
				type: c.type,
				chapter: chaptersMap.has(c.id) ? `Ch. ${chaptersMap.get(c.id)![0].number}` : 'Rekomendasi',
				time: timeAgo(c.updatedAt),
				cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
			}));
		}
	}

	// Extract all unique genres from comics table
	const genresResult = await db.select({ genres: comics.genres }).from(comics);
	const genreSet = new Set<string>();
	for (const row of genresResult) {
		if (row.genres) {
			for (const g of row.genres.split(',').map(s => s.trim()).filter(Boolean)) {
				genreSet.add(g);
			}
		}
	}
	const allGenres = Array.from(genreSet).sort();

	// Query Active Ads
	const activeAds = await db.select().from(ads).where(eq(ads.isActive, true));

	return {
		latestUpdates,
		popularComics,
		featuredComics,
		activeAnnouncements,
		continueReading,
		followedUpdates,
		forYouComics,
		activeAds,
		allGenres,
		searchQuery,
		typeFilter: typeFilter || 'All',
		genreFilter,
		currentPage: page,
		totalPages
	};
};
