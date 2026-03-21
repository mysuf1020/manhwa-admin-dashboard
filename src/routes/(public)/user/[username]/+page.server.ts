import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, history, comics, chapters, comments } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const username = params.username;

	// Fetch Target User
	const userResult = await db
		.select({
			id: users.id,
			username: users.username,
			displayName: users.displayName,
			bio: users.bio,
			avatarUrl: users.avatarUrl,
			role: users.role,
			createdAt: users.createdAt
		})
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	if (userResult.length === 0) {
		throw error(404, 'User not found');
	}

	const targetUser = userResult[0];

	// Fetch user's recent reading history (public view)
	const recentHistory = await db
		.select({
			comicTitle: comics.title,
			comicSlug: comics.slug,
			comicCoverUrl: comics.coverUrl,
			chapterNumber: chapters.chapterNumber,
			readAt: history.readAt
		})
		.from(history)
		.innerJoin(comics, eq(history.comicId, comics.id))
		.innerJoin(chapters, eq(history.chapterId, chapters.id))
		.where(eq(history.userId, targetUser.id))
		.orderBy(desc(history.readAt))
		.limit(6);

	// Fetch user's recent comments
	const recentComments = await db
		.select({
			content: comments.content,
			createdAt: comments.createdAt,
			comicSlug: comics.slug,
			comicTitle: comics.title,
			chapterNumber: chapters.chapterNumber
		})
		.from(comments)
		.innerJoin(comics, eq(comments.comicId, comics.id))
		.innerJoin(chapters, eq(comments.chapterId, chapters.id))
		.where(eq(comments.userId, targetUser.id))
		.orderBy(desc(comments.createdAt))
		.limit(10);

	return {
		targetUser,
		recentHistory,
		recentComments
	};
};
