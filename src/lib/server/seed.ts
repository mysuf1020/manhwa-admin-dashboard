import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { comics, chapters } from './schema';

const { Pool } = pkg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

async function seed() {
	console.log('Seeding local database dummy data...');
	const existing = await db.select().from(comics);
	if (existing.length > 0) {
		console.log('Database already seeded. Skipping.');
		process.exit(0);
	}

	await db.insert(comics).values([
		{
			title: 'Solo Leveling',
			slug: 'solo-leveling',
			description:
				'10 years ago, after "the Gate" that connected the real world with the monster world opened...',
			author: 'Chugong',
			coverUrl: 'https://picsum.photos/seed/solo/300/400'
		},
		{
			title: 'Omniscient Reader',
			slug: 'omniscient-reader',
			description:
				'Only I know the end of this world. One day our MC finds himself stuck in the world of his favorite webnovel.',
			author: 'Sing Shong',
			coverUrl: 'https://picsum.photos/seed/orv/300/400'
		},
		{
			title: 'The Beginning After The End',
			slug: 'tbate',
			description:
				'King Grey has unrivaled strength, wealth, and prestige in a martial world governed by martial ability.',
			author: 'TurtleMe',
			coverUrl: 'https://picsum.photos/seed/tbate/300/400'
		}
	]);

	const insertedComics = await db.select().from(comics);
	const soloLeveling = insertedComics.find((c) => c.slug === 'solo-leveling');

	if (soloLeveling) {
		await db.insert(chapters).values([
			{ comicId: soloLeveling.id, chapterNumber: '1', title: 'Prologue' },
			{ comicId: soloLeveling.id, chapterNumber: '2', title: 'Chapter 2' }
		]);
	}

	console.log('✅ Database seeded successfully!');
	process.exit(0);
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
