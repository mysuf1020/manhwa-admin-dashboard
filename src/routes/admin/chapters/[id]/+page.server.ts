import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, pages } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const chapterId = parseInt(params.id);
	if (isNaN(chapterId)) throw error(400, 'Invalid chapter ID');

	const chapterResult = await db.select().from(chapters).where(eq(chapters.id, chapterId));
	if (chapterResult.length === 0) throw error(404, 'Chapter not found');
	const chapter = chapterResult[0];

	const comicResult = await db.select().from(comics).where(eq(comics.id, chapter.comicId));
	const comic = comicResult[0];

	const chapterPages = await db
		.select()
		.from(pages)
		.where(eq(pages.chapterId, chapterId))
		.orderBy(asc(pages.pageNumber));

	return { chapter, comic, pages: chapterPages };
};

export const actions: Actions = {
	addPages: async ({ request, params }) => {
		const chapterId = parseInt(params.id);
		const formData = await request.formData();
		const urlsText = formData.get('urls') as string;

		if (!urlsText || !urlsText.trim())
			return fail(400, { error: 'Please provide at least one URL' });

		const newUrls = urlsText
			.split('\n')
			.map((u) => u.trim())
			.filter((u) => u.length > 0);
		if (newUrls.length === 0) return fail(400, { error: 'No valid URLs found' });

		// Get max page number currently
		const existingPages = await db
			.select()
			.from(pages)
			.where(eq(pages.chapterId, chapterId))
			.orderBy(asc(pages.pageNumber));
		let nextNumber =
			existingPages.length > 0 ? existingPages[existingPages.length - 1].pageNumber + 1 : 1;

		const insertData = newUrls.map((url) => {
			const data = {
				chapterId,
				pageNumber: nextNumber,
				imageUrl: url
			};
			nextNumber++;
			return data;
		});

		try {
			await db.insert(pages).values(insertData);
			return { success: true, count: insertData.length };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to insert pages' });
		}
	},
	deletePage: async ({ request }) => {
		const formData = await request.formData();
		const idStr = formData.get('id') as string;
		if (!idStr) return fail(400, { error: 'Invalid ID' });

		try {
			await db.delete(pages).where(eq(pages.id, parseInt(idStr)));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to delete page' });
		}
	},
	deleteAllPages: async ({ params }) => {
		const chapterId = parseInt(params.id);
		try {
			await db.delete(pages).where(eq(pages.chapterId, chapterId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to delete all pages' });
		}
	}
};
