import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { comics, chapters, pages } from '$lib/server/schema';
import { uploadFile } from '$lib/server/s3';
import { eq, asc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import JSZip from 'jszip';

export const load: PageServerLoad = async ({ params }) => {
	const chapterId = parseInt(params.id);
	if (isNaN(chapterId)) throw error(400, 'Invalid chapter ID');

	const chapterResult = await db.select().from(chapters).where(eq(chapters.id, chapterId));
	if (chapterResult.length === 0) throw error(404, 'Chapter not found');
	const chapter = chapterResult[0];

	const comicResult = await db.select().from(comics).where(eq(comics.id, chapter.comicId));
	const comic = comicResult[0];

	const chapterPages = await db
		.select()
		.from(pages)
		.where(eq(pages.chapterId, chapterId))
		.orderBy(asc(pages.pageNumber));

	return { chapter, comic, pages: chapterPages };
};

export const actions: Actions = {
	addPages: async ({ request, params }) => {
		const chapterId = parseInt(params.id);
		const formData = await request.formData();
		const files = formData.getAll('pages') as File[];

		if (!files || files.length === 0 || files[0].size === 0)
			return fail(400, { error: 'Tolong pilih minimal satu file gambar legit.' });

		const chapterRecord = await db.select().from(chapters).where(eq(chapters.id, chapterId));
		if (!chapterRecord.length) return fail(404, { error: 'Unknown Chapter' });
		const comicRecord = await db.select().from(comics).where(eq(comics.id, chapterRecord[0].comicId));
		const comicSlug = comicRecord.length ? comicRecord[0].slug : 'unknown-comic';

		const r2FolderPath = `panels/${comicSlug}/${chapterRecord[0].chapterNumber}`;

		const existingPages = await db
			.select()
			.from(pages)
			.where(eq(pages.chapterId, chapterId))
			.orderBy(asc(pages.pageNumber));
		let nextNumber =
			existingPages.length > 0 ? existingPages[existingPages.length - 1].pageNumber + 1 : 1;

		try {
			const uploadPromises = files.map(file => uploadFile(file, r2FolderPath));
			const uploadedUrls = await Promise.all(uploadPromises);

			const insertData = uploadedUrls.map((url) => {
				const data = {
					chapterId,
					pageNumber: nextNumber,
					imageUrl: url
				};
				nextNumber++;
				return data;
			});

			await db.insert(pages).values(insertData);
			return { success: true, count: insertData.length };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal push aset ke Cloudflare R2 / Database' });
		}
	},
	addPagesFromZip: async ({ request, params }) => {
		const chapterId = parseInt(params.id);
		const formData = await request.formData();
		const zipFile = formData.get('zipfile') as File;

		if (!zipFile || zipFile.size === 0)
			return fail(400, { error: 'Tolong pilih file ZIP yang valid.' });

		const chapterRecord = await db.select().from(chapters).where(eq(chapters.id, chapterId));
		if (!chapterRecord.length) return fail(404, { error: 'Unknown Chapter' });
		const comicRecord = await db.select().from(comics).where(eq(comics.id, chapterRecord[0].comicId));
		const comicSlug = comicRecord.length ? comicRecord[0].slug : 'unknown-comic';

		const r2FolderPath = `panels/${comicSlug}/${chapterRecord[0].chapterNumber}`;

		const existingPages = await db
			.select()
			.from(pages)
			.where(eq(pages.chapterId, chapterId))
			.orderBy(asc(pages.pageNumber));
		let nextNumber =
			existingPages.length > 0 ? existingPages[existingPages.length - 1].pageNumber + 1 : 1;

		try {
			const zipBuffer = await zipFile.arrayBuffer();
			const zip = await JSZip.loadAsync(zipBuffer);

			// Filter only image files, sort by filename for correct order
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
			const imageFiles = Object.keys(zip.files)
				.filter((name) => {
					const lower = name.toLowerCase();
					return !zip.files[name].dir && imageExtensions.some((ext) => lower.endsWith(ext));
				})
				.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

			if (imageFiles.length === 0) {
				return fail(400, { error: 'ZIP tidak mengandung file gambar (jpg/png/webp).' });
			}

			const insertData: { chapterId: number; pageNumber: number; imageUrl: string }[] = [];

			for (const fileName of imageFiles) {
				const fileData = await zip.files[fileName].async('arraybuffer');
				const ext = fileName.split('.').pop() || 'jpg';
				const mimeMap: Record<string, string> = {
					jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
					webp: 'image/webp', gif: 'image/gif'
				};
				const blob = new File([fileData], fileName, { type: mimeMap[ext.toLowerCase()] || 'image/jpeg' });
				const url = await uploadFile(blob, r2FolderPath);

				insertData.push({
					chapterId,
					pageNumber: nextNumber,
					imageUrl: url
				});
				nextNumber++;
			}

			await db.insert(pages).values(insertData);
			return { success: true, count: insertData.length };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal mengekstrak ZIP atau upload ke R2' });
		}
	},
	addPagesByUrl: async ({ request, params }) => {
		const chapterId = parseInt(params.id);
		const formData = await request.formData();
		const urlsText = formData.get('urls') as string;

		if (!urlsText || !urlsText.trim())
			return fail(400, { error: 'Please provide at least one URL' });

		const newUrls = urlsText
			.split('\n')
			.map((u) => u.trim())
			.filter((u) => u.length > 0);
		if (newUrls.length === 0) return fail(400, { error: 'No valid URLs found' });

		const existingPages = await db
			.select()
			.from(pages)
			.where(eq(pages.chapterId, chapterId))
			.orderBy(asc(pages.pageNumber));
		let nextNumber =
			existingPages.length > 0 ? existingPages[existingPages.length - 1].pageNumber + 1 : 1;

		const insertData = newUrls.map((url) => {
			const data = {
				chapterId,
				pageNumber: nextNumber,
				imageUrl: url
			};
			nextNumber++;
			return data;
		});

		try {
			await db.insert(pages).values(insertData);
			return { success: true, count: insertData.length, mode: 'URL' };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to insert pages' });
		}
	},
	deletePage: async ({ request }) => {
		const formData = await request.formData();
		const idStr = formData.get('id') as string;
		if (!idStr) return fail(400, { error: 'Invalid ID' });

		try {
			await db.delete(pages).where(eq(pages.id, parseInt(idStr)));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to delete page' });
		}
	},
	deleteAllPages: async ({ params }) => {
		const chapterId = parseInt(params.id);
		try {
			await db.delete(pages).where(eq(pages.chapterId, chapterId));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Failed to delete all pages' });
		}
	}
};
