import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	// Temukan profil komik berdasarkan URL slug
	const comicData = await db.select().from(comics).where(eq(comics.slug, params.slug)).limit(1);

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

	return {
		comic,
		chapters: chapterList
	};
};
