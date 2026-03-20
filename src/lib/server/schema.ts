import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// Tabel Direktori Utama Komik
export const comics = pgTable('comics', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(), // Untuk URL cantik (misal: /comic/solo-leveling)
	description: text('description'),
	author: varchar('author', { length: 255 }),
	status: varchar('status', { length: 50 }).default('Ongoing'),
	type: varchar('type', { length: 50 }).default('Manhwa').notNull(),
	genres: varchar('genres', { length: 255 }),
	coverUrl: text('cover_url'),
	sourceUrl: text('source_url'), // Digunakan jika web melakukan scraping dari web aslinya
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Tabel Rilisan Chapter
export const chapters = pgTable('chapters', {
	id: serial('id').primaryKey(),
	comicId: integer('comic_id')
		.references(() => comics.id)
		.notNull(), // Menyambung ke tabel komik
	chapterNumber: varchar('chapter_number', { length: 50 }).notNull(),
	title: varchar('title', { length: 255 }),
	sourceUrl: text('source_url'), // Menyimpan link asli chapter jika discrape
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Gambar Scroll per Panel di dalam 1 Chapter
export const pages = pgTable('pages', {
	id: serial('id').primaryKey(),
	chapterId: integer('chapter_id')
		.references(() => chapters.id)
		.notNull(), // Menyambung ke chapter
	pageNumber: integer('page_number').notNull(), // Urutan gambar (1, 2, 3...)
	imageUrl: text('image_url').notNull() // URL ke object storage Cloudflare R2
});

// Tabel Pengguna (Auth)
export const users = pgTable('users', {
	id: text('id').primaryKey(), // UUID string
	username: varchar('username', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: varchar('role', { length: 50 }).default('user'), // 'user' atau 'admin'
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Sesi Login (Stateful Auth)
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Tabel Bookmark (Favorit)
export const bookmarks = pgTable('bookmarks', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	comicId: integer('comic_id')
		.notNull()
		.references(() => comics.id),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Riwayat Bacaan (History)
export const history = pgTable('history', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	comicId: integer('comic_id')
		.notNull()
		.references(() => comics.id),
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id),
	readAt: timestamp('read_at').defaultNow().notNull()
});
