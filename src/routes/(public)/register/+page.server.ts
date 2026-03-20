import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { randomUUID } from 'node:crypto';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			typeof confirmPassword !== 'string' ||
			username.length < 3 ||
			password.length < 6
		) {
			return fail(400, {
				error: 'Username min. 3 karakter & Password min. 6 karakter'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Konfirmasi Sandi tidak cocok dengan sandi utama' });
		}

		const existingUser = await db.select().from(users).where(eq(users.username, username));
		if (existingUser.length > 0) {
			return fail(400, { error: 'Username ini sudah terdaftar oleh pengguna lain' });
		}

		// Check if it's the very first user registering on this DB instance, promote to Admin immediately if true
		const userCount = await db.$count(users);
		const role = userCount === 0 ? 'admin' : 'user';

		const passwordHash = await hashPassword(password);
		const userId = randomUUID();

		try {
			await db.insert(users).values({
				id: userId,
				username,
				passwordHash,
				role
			});

			// Auto login
			const session = await createSession(userId);
			setSessionTokenCookie(event, session.id, session.expiresAt);
		} catch (e) {
			return fail(500, { error: 'Kegagalan Server saat pendaftaran.' });
		}

		throw redirect(302, '/');
	}
};
