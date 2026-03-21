import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { eq, desc, isNotNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Ambil komik yang berstatus Ongoing dan punya jadwal (updateDay != null)
	const scheduledComics = await db
		.select()
		.from(comics)
		.where(
			and(
				eq(comics.status, 'Ongoing'),
				isNotNull(comics.updateDay)
			)
		)
		.orderBy(desc(comics.viewCount));

	// Group berdasarkan hari
	const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
	const grouped = days.reduce((acc, day) => {
		acc[day] = scheduledComics.filter((c) => c.updateDay === day).map((c) => ({
			id: c.id,
			slug: c.slug,
			title: c.title,
			type: c.type,
			cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400',
			genres: c.genres
		}));
		return acc;
	}, {} as Record<string, any[]>);

	return {
		schedule: grouped,
		days
	};
};
