import { db } from './db';
import { users, sessions } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

// ---- Password Hashing ----
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

// ---- Session Management ----
export function generateSessionId(): string {
	return randomUUID(); // Secure unique identifier
}

export async function createSession(userId: string): Promise<{ id: string; userId: string; expiresAt: Date }> {
	const sessionId = generateSessionId();
	// Session valid for 30 days
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	const [session] = await db
		.insert(sessions)
		.values({
			id: sessionId,
			userId,
			expiresAt
		})
		.returning();

	return session;
}

export async function validateSessionToken(sessionId: string) {
	const result = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));

	if (result.length < 1) {
		return { session: null, user: null };
	}

	const { user, session } = result[0];

	// Extract passwordHash from user object to strictly prevent leaks to the presentation layer
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { passwordHash: _, ...safeUser } = user;

	// Check if expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	// Auto-extend session if it's closer to expiration (e.g., less than 15 days left)
	const fifteenDaysInMs = 1000 * 60 * 60 * 24 * 15;
	if (session.expiresAt.getTime() - Date.now() < fifteenDaysInMs) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessions.id, session.id));
	}

	return { session, user: safeUser };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// ---- Cookie Utilities ----
export function setSessionTokenCookie(
	event: import('@sveltejs/kit').RequestEvent,
	token: string,
	expiresAt: Date
) {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: import('@sveltejs/kit').RequestEvent) {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
