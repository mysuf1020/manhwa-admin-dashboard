import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/s3';

export const load: PageServerLoad = async ({ params }) => {
	const result = await db.select().from(comics).where(eq(comics.slug, params.slug));
	if (result.length === 0) throw error(404, 'Comic not found');
	return { comic: result[0] };
};

export const actions: Actions = {
	updateComic: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const author = formData.get('author') as string;
		const status = formData.get('status') as string;
		const type = formData.get('type') as string;
		const genres = formData.get('genres') as string;
		const coverFile = formData.get('cover') as File;

		if (!title) return fail(400, { error: 'Title is required' });

		const comicResult = await db.select().from(comics).where(eq(comics.slug, params.slug));
		if (!comicResult.length) return fail(404, { error: 'Comic not found' });

		try {
			let coverUrl: string | undefined;
			if (coverFile && coverFile.size > 0) {
				coverUrl = await uploadFile(coverFile, 'covers');
			}

			const updateData: Record<string, string | null> = {
				title,
				description: description || null,
				author: author || null,
				status: status || 'Ongoing',
				type: type || 'Manhwa',
				genres: genres || null,
				updatedAt: new Date().toISOString()
			};

			if (coverUrl) {
				updateData.coverUrl = coverUrl;
			}

			await db.update(comics).set(updateData).where(eq(comics.id, comicResult[0].id));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message });
		}
	},
	deleteComic: async ({ params }) => {
		const result = await db.select().from(comics).where(eq(comics.slug, params.slug));
		if (!result.length) return fail(404, { error: 'Comic not found' });

		try {
			await db.delete(comics).where(eq(comics.id, result[0].id));
			throw redirect(302, '/admin/comics');
		} catch (e) {
			if ((e as { status?: number }).status === 302) throw e;
			return fail(500, { error: (e as Error).message });
		}
	}
};
