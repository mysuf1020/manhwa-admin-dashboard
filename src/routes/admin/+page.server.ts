import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters } from '$lib/server/schema';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Real stats from DB
	const comicCount = await db.select({ count: sql`count(*)` }).from(comics);
	const chapterCount = await db.select({ count: sql`count(*)` }).from(chapters);
	const totalViews = await db.select({ total: sql`COALESCE(sum(view_count), 0)` }).from(comics);

	// Recent chapters with comic info
	const recentChapters = await db.execute(sql`
		SELECT ch.id, ch.chapter_number, ch.created_at, c.title as comic_title, c.slug as comic_slug
		FROM chapters ch
		JOIN comics c ON ch.comic_id = c.id
		ORDER BY ch.created_at DESC
		LIMIT 8
	`);

	// Analytics data for charts
	const topComicsRows = await db.execute(sql`SELECT title, view_count FROM comics ORDER BY view_count DESC LIMIT 5`);
	const statusDistRows = await db.execute(sql`SELECT status, COUNT(*) as count FROM comics GROUP BY status`);
	const typeDistRows = await db.execute(sql`SELECT type, COUNT(*) as count FROM comics GROUP BY type`);

	return {
		stats: {
			comics: Number(comicCount[0]?.count) || 0,
			chapters: Number(chapterCount[0]?.count) || 0,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			views: Number((totalViews as any)[0]?.total) || 0
		},
		charts: {
			topComics: topComicsRows.rows || topComicsRows,
			statusDist: statusDistRows.rows || statusDistRows,
			typeDist: typeDistRows.rows || typeDistRows
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recentChapters: (recentChapters.rows || recentChapters).map((r: any) => ({
			id: r.id,
			chapterNumber: r.chapter_number,
			comicTitle: r.comic_title,
			comicSlug: r.comic_slug,
			createdAt: r.created_at
		}))
	};
};
