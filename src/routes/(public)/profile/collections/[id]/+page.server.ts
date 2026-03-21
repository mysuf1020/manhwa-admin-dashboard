import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { collections, collectionItems, comics, users } from '$lib/server/schema';
import { eq, desc, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	const collectionId = parseInt(event.params.id);

	if (isNaN(collectionId)) {
		throw error(404, 'Koleksi tidak ditemukan');
	}

	const collectionData = await db
		.select({
			id: collections.id,
			name: collections.name,
			description: collections.description,
			isPublic: collections.isPublic,
			createdAt: collections.createdAt,
			authorId: users.id,
			authorName: users.displayName,
			authorUsername: users.username,
			authorAvatar: users.avatarUrl
		})
		.from(collections)
		.innerJoin(users, eq(collections.userId, users.id))
		.where(eq(collections.id, collectionId))
		.limit(1)
		.then((res) => res[0]);

	if (!collectionData) {
		throw error(404, 'Koleksi tidak ditemukan');
	}

	// Privacy Check
	if (!collectionData.isPublic && (!user || user.id !== collectionData.authorId)) {
		throw error(403, 'Koleksi ini bersifat privat');
	}

	// Fetch items
	const items = await db
		.select({
			id: collectionItems.id,
			comicId: comics.id,
			title: comics.title,
			slug: comics.slug,
			coverUrl: comics.coverUrl,
			status: comics.status,
			genres: comics.genres,
			createdAt: collectionItems.createdAt
		})
		.from(collectionItems)
		.innerJoin(comics, eq(collectionItems.comicId, comics.id))
		.where(eq(collectionItems.collectionId, collectionId))
		.orderBy(desc(collectionItems.createdAt));

	return {
		collection: collectionData,
		items,
		isOwner: user?.id === collectionData.authorId
	};
};

export const actions: Actions = {
	removeItem: async ({ request, locals, params }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const itemId = parseInt(formData.get('itemId')?.toString() || '0');
		const collectionId = parseInt(params.id);

		if (!itemId || !collectionId) return fail(400, { error: 'Invalid data' });

		// Verify Ownership
		const col = await db.select({ userId: collections.userId }).from(collections).where(eq(collections.id, collectionId)).limit(1).then(r => r[0]);
		if (!col || col.userId !== user.id) return fail(403, { error: 'Forbidden' });

		try {
			await db.delete(collectionItems).where(and(eq(collectionItems.id, itemId), eq(collectionItems.collectionId, collectionId)));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal menghapus komik' });
		}
	},
	togglePrivacy: async ({ request, locals, params }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const collectionId = parseInt(params.id);
		const formData = await request.formData();
		const isPublicStr = formData.get('isPublic')?.toString();
		const isPublic = isPublicStr === 'true';

		const col = await db.select({ userId: collections.userId }).from(collections).where(eq(collections.id, collectionId)).limit(1).then(r => r[0]);
		if (!col || col.userId !== user.id) return fail(403, { error: 'Forbidden' });

		try {
			await db.update(collections).set({ isPublic: !isPublic }).where(eq(collections.id, collectionId));
			return { success: true };
		} catch {
			return fail(500, { error: 'Gagal mengubah pengaturan privasi' });
		}
	},
	deleteCollection: async ({ locals, params }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const collectionId = parseInt(params.id);
		const col = await db.select({ userId: collections.userId }).from(collections).where(eq(collections.id, collectionId)).limit(1).then(r => r[0]);
		if (!col || col.userId !== user.id) return fail(403, { error: 'Forbidden' });

		try {
			await db.delete(collections).where(eq(collections.id, collectionId));
			throw redirect(302, '/profile');
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && e.status === 302) {
				throw e; // throw existing redirect to SvelteKit internals
			}
			return fail(500, { error: 'Gagal menghapus koleksi' });
		}
	}
};
