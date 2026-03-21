import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters } from '$lib/server/schema';

export const GET: RequestHandler = async () => {
	const allComics = await db.select({ slug: comics.slug, updatedAt: comics.updatedAt }).from(comics);
	const allChapters = await db.select({
		comicId: chapters.comicId,
		chapterNumber: chapters.chapterNumber,
		createdAt: chapters.createdAt
	}).from(chapters);

	// Map comic IDs to slugs
	const comicSlugs = await db.select({ id: comics.id, slug: comics.slug }).from(comics);
	const slugMap = new Map(comicSlugs.map((c) => [c.id, c.slug]));

	const baseUrl = 'https://mangareader.id'; // TODO: set from env

	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>`;

	for (const comic of allComics) {
		xml += `\n  <url><loc>${baseUrl}/comic/${comic.slug}</loc><lastmod>${new Date(comic.updatedAt || Date.now()).toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>`;
	}

	for (const ch of allChapters) {
		const slug = slugMap.get(ch.comicId);
		if (slug) {
			xml += `\n  <url><loc>${baseUrl}/comic/${slug}/${ch.chapterNumber}</loc><lastmod>${new Date(ch.createdAt || Date.now()).toISOString().split('T')[0]}</lastmod><priority>0.6</priority></url>`;
		}
	}

	xml += '\n</urlset>';

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
