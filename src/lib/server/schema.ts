import { pgTable, serial, text, varchar, timestamp, integer, real, unique, boolean } from 'drizzle-orm/pg-core';

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
	averageRating: real('average_rating').default(0).notNull(), // Perhitungan Cache untuk Rendering Cepat
	ratingCount: integer('rating_count').default(0).notNull(), // Total orang yang me-rating
	viewCount: integer('view_count').default(0).notNull(), // Analytics Total Dilihat
	isFeatured: boolean('is_featured').default(false).notNull(), // Komik Pilihan Editor
	isMature: boolean('is_mature').default(false).notNull(), // Konten Dewasa 18+
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
	role: varchar('role', { length: 50 }).default('user'), // 'user', 'admin', 'banned'
	displayName: varchar('display_name', { length: 255 }),
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	readingMode: varchar('reading_mode', { length: 20 }).default('scroll'), // 'scroll' atau 'page'
	theme: varchar('theme', { length: 20 }).default('dark'), // 'dark' atau 'light'
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

// Tabel Penilaian Komik (Rating 1-5 Bintang)
export const ratings = pgTable('ratings', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	comicId: integer('comic_id')
		.notNull()
		.references(() => comics.id, { onDelete: 'cascade' }),
	score: integer('score').notNull(), // Disarankan membatasi insert antara 1 hingga 5
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	unq: unique().on(t.userId, t.comicId) // Memaksa 1 User hanya boleh memilliki 1 row rating per komik
}));

// Tabel Komentar Diskusi Chapter
export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	comicId: integer('comic_id')
		.notNull()
		.references(() => comics.id, { onDelete: 'cascade' }),
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id, { onDelete: 'cascade' }), // Komentar terikat kuat pada sebuah Chapter spesifik
	parentId: integer('parent_id'), // Self-referencing: null = top-level, integer = reply to comment ID
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Notifikasi (Chapter Baru, dll)
export const notifications = pgTable('notifications', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	type: varchar('type', { length: 50 }).notNull(), // 'new_chapter', 'reply', dll
	comicId: integer('comic_id')
		.references(() => comics.id, { onDelete: 'cascade' }),
	chapterId: integer('chapter_id')
		.references(() => chapters.id, { onDelete: 'cascade' }),
	message: text('message').notNull(),
	isRead: boolean('is_read').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Analitik Popularitas Mingguan (1 Minggu Terakhir)
export const comicViews = pgTable('comic_views', {
	id: serial('id').primaryKey(),
	comicId: integer('comic_id')
		.notNull()
		.references(() => comics.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabel Pengumuman & Banner Iklan
export const announcements = pgTable('announcements', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	imageUrl: text('image_url'), // Banner gambar (R2 atau URL)
	linkUrl: text('link_url'), // URL tujuan saat diklik
	content: text('content'), // Isi pengumuman (opsional)
	isActive: boolean('is_active').default(true).notNull(),
	sortOrder: integer('sort_order').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
