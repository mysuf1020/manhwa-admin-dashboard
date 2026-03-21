import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { uploadFile } from '$lib/server/s3';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	const userResult = await db.select().from(users).where(eq(users.id, locals.user.id));
	if (userResult.length === 0) throw redirect(302, '/login');

	const user = userResult[0];
	return {
		profile: {
			username: user.username,
			displayName: user.displayName,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
			readingMode: user.readingMode,
			theme: user.theme
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const displayName = formData.get('displayName') as string;
		const bio = formData.get('bio') as string;
		const readingMode = formData.get('readingMode') as string;
		const theme = formData.get('theme') as string;
		const avatarFile = formData.get('avatar') as File;

		try {
			let avatarUrl: string | undefined;
			if (avatarFile && avatarFile.size > 0) {
				avatarUrl = await uploadFile(avatarFile, 'avatars');
			}

			const updateData: Record<string, string | null> = {
				displayName: displayName || null,
				bio: bio || null,
				readingMode: readingMode || 'scroll',
				theme: theme || 'dark'
			};

			if (avatarUrl) {
				updateData.avatarUrl = avatarUrl;
			}

			await db.update(users).set(updateData).where(eq(users.id, locals.user.id));
			return { success: true };
		} catch (e) {
			return fail(500, { error: (e as Error).message || 'Gagal update profil' });
		}
	}
};
