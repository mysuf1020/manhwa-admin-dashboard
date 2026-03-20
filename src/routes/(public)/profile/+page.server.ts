import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { bookmarks, history, comics, chapters } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}

	// Fetch bookmarks heavily joining comic details
	const userBookmarks = await db
		.select({
			id: comics.id,
			title: comics.title,
			slug: comics.slug,
			coverUrl: comics.coverUrl,
			status: comics.status,
            chapter: chapters.chapterNumber // Add dummy chapter property because ComicCard expects it. We will improve this later.
		})
		.from(bookmarks)
		.innerJoin(comics, eq(bookmarks.comicId, comics.id))
        .leftJoin(chapters, eq(chapters.comicId, comics.id)) // Get linked chapters for card presentation logic
		.where(eq(bookmarks.userId, user.id))
		.orderBy(desc(bookmarks.createdAt));
    
    // Deduplicate bookmarks since leftJoin on chapters causes identical comics to fan-out based on chapter count
    const uniqueBookmarksMap = new Map();
    for (const b of userBookmarks) {
        if (!uniqueBookmarksMap.has(b.id)) {
            uniqueBookmarksMap.set(b.id, { ...b, chapter: b.chapter ? `Ch. ${b.chapter}` : '-' });
        }
    }
    const cleanBookmarks = Array.from(uniqueBookmarksMap.values());

	// Fetch reading history with actual chapter linkage
	const userHistory = await db
		.select({
			id: history.id,
			comicTitle: comics.title,
			comicSlug: comics.slug,
			comicCoverUrl: comics.coverUrl,
			chapterNumber: chapters.chapterNumber,
			chapterId: chapters.id,
			readAt: history.readAt
		})
		.from(history)
		.innerJoin(comics, eq(history.comicId, comics.id))
		.innerJoin(chapters, eq(history.chapterId, chapters.id))
		.where(eq(history.userId, user.id))
		.orderBy(desc(history.readAt))
		.limit(20);

	return {
		userBookmarks: cleanBookmarks,
		userHistory
	};
};
