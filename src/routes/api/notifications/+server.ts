import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/schema';
import { eq, and, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ notifications: [], unread: 0 });

	const userNotifs = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, locals.user.id))
		.orderBy(desc(notifications.createdAt))
		.limit(20);

	const unread = userNotifs.filter((n) => !n.isRead).length;

	return json({ notifications: userNotifs, unread });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const { action, id } = await request.json();

	if (action === 'markRead' && id) {
		await db
			.update(notifications)
			.set({ isRead: true })
			.where(and(eq(notifications.id, id), eq(notifications.userId, locals.user.id)));
	} else if (action === 'markAllRead') {
		await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.userId, locals.user.id));
	}

	return json({ success: true });
};
