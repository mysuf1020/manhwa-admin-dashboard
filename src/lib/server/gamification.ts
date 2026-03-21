import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Adds experience points to a user and calculates their new level.
 * Formula: Level = Math.floor(Math.sqrt(experience / 10)) + 1
 *
 * Example progressions:
 * EXP 0   -> Lvl 1
 * EXP 10  -> Lvl 2
 * EXP 40  -> Lvl 3
 * EXP 90  -> Lvl 4
 * EXP 160 -> Lvl 5
 */
export async function addExperience(userId: string, amount: number) {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
			columns: { experience: true, level: true }
		});

		if (!user) return;

		const newExp = user.experience + amount;
		const newLevel = Math.floor(Math.sqrt(newExp / 10)) + 1;

		await db.update(users)
			.set({ experience: newExp, level: newLevel })
			.where(eq(users.id, userId));
	} catch (error) {
		console.error('Error adding experience:', error);
	}
}
