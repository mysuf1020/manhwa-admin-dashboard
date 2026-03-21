import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, followers, chapters } from '$lib/server/schema';
import { eq, desc, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) throw redirect(302, '/login');

	// 1. Get all comicIDs the user follows
	const userFollows = await db.select({ comicId: followers.comicId }).from(followers).where(eq(followers.userId, user.id));
	if (userFollows.length === 0) return { followedUpdates: [] };

	const followedComicIds = userFollows.map(f => f.comicId);

	// 2. Query chapters that belong to followed comics, ordered by newest chapter
	const updates = await db.select({
		chapterId: chapters.id,
		chapterNumber: chapters.chapterNumber,
		chapterTitle: chapters.title,
		createdAt: chapters.createdAt,
		comicId: comics.id,
		comicSlug: comics.slug,
		comicTitle: comics.title,
		comicCover: comics.coverUrl,
		comicType: comics.type
	})
	.from(chapters)
	.innerJoin(comics, eq(chapters.comicId, comics.id))
	.where(inArray(comics.id, followedComicIds))
	.orderBy(desc(chapters.createdAt))
	.limit(30);

	return {
		followedUpdates: updates
	};
};
