import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const comicResult = await db.select().from(comics).where(eq(comics.slug, params.slug));
	if (comicResult.length === 0) throw error(404, 'Comic not found');

	const comic = comicResult[0];
	// Pastikan ini menggunakan numeric cast karena chapternumber dibilang varchar, tapi bisa pake default sort alphanum
	const allChapters = await db.select().from(chapters).where(eq(chapters.comicId, comic.id));

	// Sort manual di javascript memastikan nomor chapter 10 > 2 meskipun string
	allChapters.sort((a, b) => parseFloat(b.chapterNumber) - parseFloat(a.chapterNumber));

	return { comic, chapters: allChapters };
};

export const actions: Actions = {
	createChapter: async ({ request }) => {
		const formData = await request.formData();
		const chapterNumber = formData.get('chapterNumber') as string;
		const title = formData.get('title') as string;
		const comicId = formData.get('comicId') as string;

		if (!chapterNumber || !comicId)
			return fail(400, { error: 'Chapter Number and Comic ID are required' });

		try {
			await db.insert(chapters).values({
				comicId: parseInt(comicId),
				chapterNumber,
				title: title || null
			});
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to create chapter' });
		}
	},
	deleteChapter: async ({ request }) => {
		const formData = await request.formData();
		const idStr = formData.get('id') as string;
		if (!idStr) return fail(400, { error: 'Invalid ID' });

		try {
			await db.delete(chapters).where(eq(chapters.id, parseInt(idStr)));
			return { success: true };
		} catch (e) {
			return fail(500, {
				error:
					(e as Error).message ||
					'Failed to delete chapter. Please delete internal page panels first.'
			});
		}
	}
};
