import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, bookmarks, ratings, comicViews, collections, collectionItems } from '$lib/server/schema';
import { eq, desc, and, sql, ne, ilike, or } from 'drizzle-orm';
import { addExperience } from '$lib/server/gamification';

export const load: PageServerLoad = async (event) => {
	// Temukan profil komik berdasarkan URL slug
	const comicData = await db.select().from(comics).where(eq(comics.slug, event.params.slug)).limit(1);

	if (!comicData || comicData.length === 0) {
		error(404, 'Data komik tidak dapat ditemukan.');
	}

	const comic = comicData[0];

	// Hitung dan Increment Analytics View Count
	await db.update(comics)
		.set({ viewCount: comic.viewCount + 1 })
		.where(eq(comics.id, comic.id));

	// Catat Analytics View 1 Minggu Terakhir (Khusus Trending)
	await db.insert(comicViews).values({ comicId: comic.id });

	const currentViewCount = comic.viewCount + 1;

	// Tarik seluruh daftar chapter
	const chapterList = await db
		.select()
		.from(chapters)
		.where(eq(chapters.comicId, comic.id))
		.orderBy(desc(chapters.createdAt)); // Semakin baru letaknya makin atas

	// Cek status bookmark dan rating personal jika user login
	let isBookmarked = false;
	let userRating: number | null = null;
	const user = event.locals.user;
	if (user) {
		const result = await db
			.select()
			.from(bookmarks)
			.where(and(eq(bookmarks.userId, user.id), eq(bookmarks.comicId, comic.id)));
		isBookmarked = result.length > 0;

		const ratingResult = await db
			.select()
			.from(ratings)
			.where(and(eq(ratings.userId, user.id), eq(ratings.comicId, comic.id)));
		if (ratingResult.length > 0) {
			userRating = ratingResult[0].score;
		}
	}

	// Cek custom collections yang dimiliki user dan apakah komik ini ada di dalamnya
	let userCollections: { id: number; name: string; isPublic: boolean; hasComic: boolean }[] = [];
	if (user) {
		const cols = await db.select({
			id: collections.id,
			name: collections.name,
			isPublic: collections.isPublic
		}).from(collections).where(eq(collections.userId, user.id));

		if (cols.length > 0) {
			const items = await db.select({ collectionId: collectionItems.collectionId }).from(collectionItems).where(eq(collectionItems.comicId, comic.id));
			const itemSet = new Set(items.map(i => i.collectionId));

			userCollections = cols.map(c => ({
				...c,
				hasComic: itemSet.has(c.id)
			}));
		}
	}

	// Query Related Comics (genre overlap)
	let relatedComics: { id: number; slug: string; title: string; cover: string; type: string }[] = [];
	if (comic.genres) {
		const genreList = comic.genres.split(',').map((g) => g.trim()).filter(Boolean);
		if (genreList.length > 0) {
			const genreConditions = genreList.slice(0, 3).map((g) => ilike(comics.genres, `%${g}%`));
			const related = await db
				.select()
				.from(comics)
				.where(and(ne(comics.id, comic.id), or(...genreConditions)))
				.orderBy(desc(comics.viewCount))
				.limit(6);
			relatedComics = related.map((c) => ({
				id: c.id,
				slug: c.slug,
				title: c.title,
				cover: c.coverUrl || 'https://picsum.photos/seed/placeholder/300/400',
				type: c.type
			}));
		}
	}

	return {
		comic: { ...comic, viewCount: currentViewCount },
		chapters: chapterList,
		isBookmarked,
		userRating,
		relatedComics,
		userCollections,
		user
	};
};

export const actions: Actions = {
	toggleBookmark: async (event) => {
		const user = event.locals.user;
		if (!user) throw redirect(302, '/login');

		const slug = event.params.slug;
		const comicRecord = await db.select().from(comics).where(eq(comics.slug, slug)).limit(1);

		if (!comicRecord.length) return fail(404, { error: 'Komik tidak ditemukan' });
		const comic = comicRecord[0];

		const existingBookmark = await db
			.select()
			.from(bookmarks)
			.where(and(eq(bookmarks.userId, user.id), eq(bookmarks.comicId, comic.id)));

		if (existingBookmark.length > 0) {
			// Remove bookmark
			await db.delete(bookmarks).where(eq(bookmarks.id, existingBookmark[0].id));
		} else {
			// Add bookmark
			await db.insert(bookmarks).values({
				userId: user.id,
				comicId: comic.id
			});
		}

		return { success: true };
	},
	rate: async (event) => {
		const user = event.locals.user;
		if (!user) throw redirect(302, '/login');

		const formData = await event.request.formData();
		const scoreStr = formData.get('score') as string;
		const score = parseInt(scoreStr);
		if (isNaN(score) || score < 1 || score > 5) return fail(400, { error: 'Invalid score' });

		const slug = event.params.slug;
		const comicRecord = await db.select().from(comics).where(eq(comics.slug, slug)).limit(1);
		if (!comicRecord.length) return fail(404, { error: 'Komik tidak ditemukan' });
		const comic = comicRecord[0];

		// Cek apa user pernah rating komik ini
		const existingRating = await db
			.select()
			.from(ratings)
			.where(and(eq(ratings.userId, user.id), eq(ratings.comicId, comic.id)));
		
		if (existingRating.length > 0) {
			// Update jika sudah ada
			await db.update(ratings).set({ score }).where(eq(ratings.id, existingRating[0].id));
		} else {
			// Insert jika baru pertama kali
			await db.insert(ratings).values({ userId: user.id, comicId: comic.id, score });
			// Give +5 EXP for rating
			await addExperience(user.id, 5);
		}

		// Hitung ulang rata-rata skor se-Database dan perbarui cache `comics`
		const result = await db.select({
			avgRating: sql`avg(score)`,
			count: sql`count(*)`
		}).from(ratings).where(eq(ratings.comicId, comic.id));

		const newAvg = Number(result[0].avgRating) || 0;
		const newCount = Number(result[0].count) || 0;

		await db.update(comics)
			.set({ averageRating: newAvg, ratingCount: newCount })
			.where(eq(comics.id, comic.id));

		return { success: true };
	}
};
