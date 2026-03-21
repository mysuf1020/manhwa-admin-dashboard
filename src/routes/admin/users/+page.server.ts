import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allUsers = await db
		.select({
			id: users.id,
			username: users.username,
			role: users.role,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			isVip: users.isVip,
			createdAt: users.createdAt
		})
		.from(users)
		.orderBy(desc(users.createdAt));

	return { users: allUsers };
};

export const actions: Actions = {
	setRole: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;

		if (!userId || !newRole) return fail(400, { error: 'Invalid data' });
		if (!['user', 'admin', 'banned', 'uploader'].includes(newRole)) return fail(400, { error: 'Invalid role' });

		try {
			await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal merubah role' });
		}
	},
	toggleVip: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const currentState = formData.get('isVip') === 'true';

		try {
			await db.update(users).set({ isVip: !currentState }).where(eq(users.id, userId));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal mengatur status VIP' });
		}
	}
};
