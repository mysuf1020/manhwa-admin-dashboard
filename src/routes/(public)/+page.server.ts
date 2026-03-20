import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics } from '$lib/server/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Panggil data langsung dari Local SQLite
	const allComics = await db.select().from(comics).orderBy(desc(comics.updatedAt)).limit(12);

	const latestUpdates = allComics.map((c) => ({
		id: c.id,
		slug: c.slug,
		title: c.title,
		chapter: 'Ch. 最新', // Mockup join sementara
		time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
		cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400'
	}));

	return {
		latestUpdates
	};
};
