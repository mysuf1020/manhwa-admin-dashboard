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
		userHistory,
		profile: user
	};
};

import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/s3';
import { users } from '$lib/server/schema';

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const displayName = formData.get('displayName') as string;
		const bio = formData.get('bio') as string;
		const avatarFile = formData.get('avatarUrl') as File;
		const avatarUrlExt = formData.get('avatarUrlExt') as string;

		try {
			let finalAvatarUrl: string | undefined;

			// Jika user mengupload file lokal
			if (avatarFile && avatarFile.size > 0) {
				finalAvatarUrl = await uploadFile(avatarFile, 'avatars');
			} else if (avatarUrlExt) {
				// Atau menggunakan link eksternal
				finalAvatarUrl = avatarUrlExt;
			}

			const updateData: Record<string, string | null> = {
				displayName: displayName || null,
				bio: bio || null
			};

			if (finalAvatarUrl !== undefined) {
				updateData.avatarUrl = finalAvatarUrl;
			}

			await db.update(users).set(updateData).where(eq(users.id, locals.user.id));
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to update profile' });
		}
	}
};
