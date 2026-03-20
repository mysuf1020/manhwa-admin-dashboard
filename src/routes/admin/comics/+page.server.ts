import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allComics = await db.select().from(comics).orderBy(desc(comics.createdAt));
	return { comics: allComics };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const coverUrl = formData.get('coverUrl') as string;
		const author = formData.get('author') as string;
		const status = formData.get('status') as string;
		const description = formData.get('description') as string;

		if (!title || !slug) {
			return fail(400, { error: 'Title and Slug are required' });
		}

		try {
			await db.insert(comics).values({
				title,
				slug,
				coverUrl: coverUrl || null,
				author: author || null,
				status: status || 'Ongoing',
				description: description || null
			});
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to create comic' });
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const idStr = formData.get('id') as string;
		if (!idStr) return fail(400, { error: 'Invalid ID' });

		try {
			await db.delete(comics).where(eq(comics.id, parseInt(idStr)));
			return { success: true };
		} catch (e) {
			return fail(500, {
				error: (e as Error).message || 'Cannot delete comic, maybe it has chapters attached?'
			});
		}
	}
};
