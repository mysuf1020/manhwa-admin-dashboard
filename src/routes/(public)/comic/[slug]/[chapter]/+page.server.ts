import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, pages, history } from '$lib/server/schema';
import { eq, and, asc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const { params, locals } = event;
	
	// 1. Tarik identitas komik
	const comicRecord = await db.select().from(comics).where(eq(comics.slug, params.slug)).limit(1);
	if (!comicRecord.length) error(404, 'Komik tersebut tidak ditemukan di server.');
	const comic = comicRecord[0];

	// 2. Identifikasi identitas chapter yang sedang dibaca
	const chapterRecord = await db
		.select()
		.from(chapters)
		.where(and(eq(chapters.comicId, comic.id), eq(chapters.chapterNumber, params.chapter)))
		.limit(1);

	if (!chapterRecord.length) error(404, 'Chapter tidak ditemukan.');
	const currentChapter = chapterRecord[0];

	// 3. Tarik seluruh gambar pindaian webtoon (Pages)
	const chapterPages = await db
		.select()
		.from(pages)
		.where(eq(pages.chapterId, currentChapter.id))
		.orderBy(asc(pages.pageNumber));

	// 4. Record History tracking pasif jika user login (Otomatis ditambahkan/update tiap memuat pembaca)
	const user = locals.user;
	if (user) {
		const existingHistory = await db.select().from(history).where(
			and(eq(history.userId, user.id), eq(history.comicId, comic.id))
		);

		if (existingHistory.length > 0) {
			// Update chapter terakhir yang dibaca
			await db.update(history)
				.set({ chapterId: currentChapter.id, readAt: new Date() })
				.where(eq(history.id, existingHistory[0].id));
		} else {
			// Insert riwayat komik baru
			await db.insert(history).values({
				userId: user.id,
				comicId: comic.id,
				chapterId: currentChapter.id
			});
		}
	}

	return {
		comic,
		chapter: currentChapter,
		pages: chapterPages
	};
};
