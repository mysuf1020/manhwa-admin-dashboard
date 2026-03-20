// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Omit<import('$lib/server/schema').users.$inferSelect, 'passwordHash'> | null;
			session: import('$lib/server/schema').sessions.$inferSelect | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
