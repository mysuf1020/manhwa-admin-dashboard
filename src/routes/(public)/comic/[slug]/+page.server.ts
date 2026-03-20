import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, bookmarks } from '$lib/server/schema';
import { eq, desc, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	// Temukan profil komik berdasarkan URL slug
	const comicData = await db.select().from(comics).where(eq(comics.slug, event.params.slug)).limit(1);

	if (!comicData || comicData.length === 0) {
		error(404, 'Data komik tidak dapat ditemukan.');
	}

	const comic = comicData[0];

	// Tarik seluruh daftar chapter
	const chapterList = await db
		.select()
		.from(chapters)
		.where(eq(chapters.comicId, comic.id))
		.orderBy(desc(chapters.createdAt)); // Semakin baru letaknya makin atas

	// Cek status bookmark jika user login
	let isBookmarked = false;
	const user = event.locals.user;
	if (user) {
		const result = await db
			.select()
			.from(bookmarks)
			.where(and(eq(bookmarks.userId, user.id), eq(bookmarks.comicId, comic.id)));
		isBookmarked = result.length > 0;
	}

	return {
		comic,
		chapters: chapterList,
		isBookmarked
	};
};

export const actions: Actions = {
	toggleBookmark: async (event) => {
		const user = event.locals.user;
		if (!user) throw redirect(302, '/login');

		const slug = event.params.slug;
		const comicRecord = await db.select().from(comics).where(eq(comics.slug, slug)).limit(1);

		if (!comicRecord.length) return fail(404, { error: 'Komik tidak ditemukan' });
		const comic = comicRecord[0];

		const existingBookmark = await db
			.select()
			.from(bookmarks)
			.where(and(eq(bookmarks.userId, user.id), eq(bookmarks.comicId, comic.id)));

		if (existingBookmark.length > 0) {
			// Remove bookmark
			await db.delete(bookmarks).where(eq(bookmarks.id, existingBookmark[0].id));
		} else {
			// Add bookmark
			await db.insert(bookmarks).values({
				userId: user.id,
				comicId: comic.id
			});
		}

		return { success: true };
	}
};
