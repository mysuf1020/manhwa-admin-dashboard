import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { history, comics, chapters } from '$lib/server/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login?redirect=/history');
	}

	const pageParam = url.searchParams.get('page') || '1';
	const page = parseInt(pageParam) > 0 ? parseInt(pageParam) : 1;
	const pageSize = 24;

	// Query paginated history
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
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const totalResult = await db
		.select({ count: sql`count(*)` })
		.from(history)
		.where(eq(history.userId, user.id));
	const total = Number(totalResult[0]?.count) || 0;
	const totalPages = Math.ceil(total / pageSize);

	return {
		history: historyRecords.map((h) => ({
			comicId: h.comicId,
			slug: h.slug,
			title: h.title,
			cover: h.cover || 'https://picsum.photos/seed/placeholder/300/400',
			chapterNumber: h.chapterNumber,
			readAt: h.readAt
		})),
		currentPage: page,
		totalPages,
		total
	};
};
