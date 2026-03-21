import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { reports, comics, users, chapters } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user || user.role !== 'admin') throw redirect(302, '/');

	const allReports = await db
		.select({
			id: reports.id,
			reasonCategory: reports.reasonCategory,
			description: reports.description,
			status: reports.status,
			createdAt: reports.createdAt,
			reporterUsername: users.username,
			comicTitle: comics.title,
			comicSlug: comics.slug,
			chapterNumber: chapters.chapterNumber
		})
		.from(reports)
		.innerJoin(users, eq(reports.userId, users.id))
		.innerJoin(comics, eq(reports.comicId, comics.id))
		.innerJoin(chapters, eq(reports.chapterId, chapters.id))
		.orderBy(desc(reports.createdAt));

	return { reports: allReports };
};

export const actions: Actions = {
	resolveReport: async (event) => {
		const user = event.locals.user;
		if (!user || user.role !== 'admin') throw error(401, 'Unauthorized');

		const formData = await event.request.formData();
		const reportIdStr = formData.get('reportId') as string;
		const reportId = parseInt(reportIdStr);

		if (!reportId) return fail(400, { error: 'Invalid report ID' });

		await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, reportId));
		return { success: true };
	},
	dismissReport: async (event) => {
		const user = event.locals.user;
		if (!user || user.role !== 'admin') throw error(401, 'Unauthorized');

		const formData = await event.request.formData();
		const reportIdStr = formData.get('reportId') as string;
		const reportId = parseInt(reportIdStr);

		if (!reportId) return fail(400, { error: 'Invalid report ID' });

		await db.update(reports).set({ status: 'dismissed' }).where(eq(reports.id, reportId));
		return { success: true };
	}
};
