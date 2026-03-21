import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session') ?? null;
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionId);
	if (session) {
		// Reset cookie expiration safely
		setSessionTokenCookie(event, session.id, session.expiresAt);
	} else {
		// Delete invalid/expired cookie
		deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	// Global Admin Route Protection (Mencegah Bypass Actions)
	const path = event.url.pathname;
	if (path.startsWith('/admin')) {
		if (!user || (user.role !== 'admin' && user.role !== 'uploader')) {
			return new Response('Redirect', { status: 303, headers: { Location: '/' } });
		}
		// Uploader spesific boundary
		if (user.role === 'uploader') {
			const isPermitted = path === '/admin' || path.startsWith('/admin/comics') || path.startsWith('/admin/chapters');
			if (!isPermitted) {
				return new Response('Redirect', { status: 303, headers: { Location: '/admin' } });
			}
		}
	}

	return resolve(event);
};
