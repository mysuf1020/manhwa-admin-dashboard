import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { announcements } from '$lib/server/schema';
import { uploadFile } from '$lib/server/s3';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allAnnouncements = await db
		.select()
		.from(announcements)
		.orderBy(asc(announcements.sortOrder));
	return { announcements: allAnnouncements };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const linkUrl = formData.get('linkUrl') as string;
		const content = formData.get('content') as string;
		const bannerFile = formData.get('banner') as File;
		const bannerUrlExt = formData.get('bannerUrl') as string;
		const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

		if (!title) return fail(400, { error: 'Judul pengumuman wajib diisi.' });

		try {
			let imageUrl = bannerUrlExt || null;
			if (bannerFile && bannerFile.size > 0) {
				imageUrl = await uploadFile(bannerFile, 'banners');
			}

			await db.insert(announcements).values({
				title,
				imageUrl,
				linkUrl: linkUrl || null,
				content: content || null,
				sortOrder
			});
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal membuat pengumuman' });
		}
	},
	toggleActive: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
		const currentActive = formData.get('isActive') === 'true';

		try {
			await db.update(announcements)
				.set({ isActive: !currentActive })
				.where(eq(announcements.id, id));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message });
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		try {
			await db.delete(announcements).where(eq(announcements.id, id));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal hapus pengumuman' });
		}
	}
};
