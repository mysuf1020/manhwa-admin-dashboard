import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/schema';
import { uploadFile } from '$lib/server/s3';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allAds = await db.select().from(ads).orderBy(desc(ads.createdAt));
	return { ads: allAds };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const linkUrl = formData.get('linkUrl') as string;
		const scriptCode = formData.get('scriptCode') as string;
		const positionType = formData.get('positionType') as string;
		const imageFile = formData.get('imageFile') as File;
		const imageUrlExt = formData.get('imageUrlExt') as string;

		if (!title) return fail(400, { error: 'Judul iklan wajib diisi.' });

		try {
			let imageUrl = imageUrlExt || null;
			if (imageFile && imageFile.size > 0) {
				imageUrl = await uploadFile(imageFile, 'ads');
			}

			await db.insert(ads).values({
				title,
				imageUrl,
				scriptCode: scriptCode || null,
				linkUrl: linkUrl || null,
				positionType: positionType || 'homepage_top',
				isActive: true
			});
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal membuat iklan.' });
		}
	},
	toggleActive: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
		const currentActive = formData.get('isActive') === 'true';

		try {
			await db.update(ads).set({ isActive: !currentActive }).where(eq(ads.id, id));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal mengubah status iklan.' });
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		try {
			await db.delete(ads).where(eq(ads.id, id));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal menghapus iklan.' });
		}
	}
};
