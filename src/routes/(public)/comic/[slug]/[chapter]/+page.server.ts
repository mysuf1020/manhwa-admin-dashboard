import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, pages, history, comments, users } from '$lib/server/schema';
import { eq, and, asc, desc } from 'drizzle-orm';

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

	// 2B. Hitung Navigasi Lanjut/Kembali (Next/Prev)
	const allChapters = await db
		.select({ id: chapters.id, chapterNumber: chapters.chapterNumber })
		.from(chapters)
		.where(eq(chapters.comicId, comic.id))
		.orderBy(asc(chapters.createdAt));

	const currentIndex = allChapters.findIndex(c => c.id === currentChapter.id);
	const prevChapterNumber = currentIndex > 0 ? allChapters[currentIndex - 1].chapterNumber : null;
	const nextChapterNumber = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].chapterNumber : null;

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

	// 5. Tarik Komentar (Chat Thread) untuk chapter ini
	const chapterComments = await db
		.select({
			id: comments.id,
			content: comments.content,
			createdAt: comments.createdAt,
			user: {
				id: users.id,
				username: users.username,
				role: users.role
			}
		})
		.from(comments)
		.innerJoin(users, eq(comments.userId, users.id))
		.where(eq(comments.chapterId, currentChapter.id))
		.orderBy(desc(comments.createdAt));

	return {
		comic,
		chapter: currentChapter,
		pages: chapterPages,
		comments: chapterComments,
		user,
		prevChapterNumber,
		nextChapterNumber
	};
};

export const actions: Actions = {
	addComment: async (event) => {
		const user = event.locals.user;
		if (!user) return fail(401, { error: 'Harap Login untuk berkomentar' });

		const formData = await event.request.formData();
		const content = formData.get('content') as string;
		if (!content || !content.trim()) return fail(400, { error: 'Komentar tidak boleh kosong' });

		const slug = event.params.slug;
		const chapterNumber = event.params.chapter;
		
		const comicRecord = await db.select().from(comics).where(eq(comics.slug, slug)).limit(1);
		if (!comicRecord.length) return fail(404, { error: 'Komik tidak valid' });

		const chapterRecord = await db
			.select()
			.from(chapters)
			.where(and(eq(chapters.comicId, comicRecord[0].id), eq(chapters.chapterNumber, chapterNumber)))
			.limit(1);
		if (!chapterRecord.length) return fail(404, { error: 'Chapter tidak valid' });

		await db.insert(comments).values({
			userId: user.id,
			comicId: comicRecord[0].id,
			chapterId: chapterRecord[0].id,
			content
		});

		return { success: true };
	}
};
