import { eq } from 'drizzle-orm';
import { db, pool } from './db/db.js';
import { matches } from './db/schema.js';

async function main() {
  try {
    console.log('Performing Match CRUD operations...');

    // CREATE: Insert a new match
    const [newMatch] = await db
      .insert(matches)
      .values({
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        sport: 'Football',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
      })
      .returning();

    if (!newMatch) {
      throw new Error('Failed to create match');
    }
    
    console.log('✅ CREATE: New match created:', newMatch);

    // READ: Select the match
    const foundMatch = await db.select().from(matches).where(eq(matches.id, newMatch.id));
    console.log('✅ READ: Found match:', foundMatch[0]);

    // UPDATE: Update status to 'live' and set score to 1-0
    const [updatedMatch] = await db
      .update(matches)
      .set({
        status: 'live',
        homeScore: 1,
      })
      .where(eq(matches.id, newMatch.id))
      .returning();
    
    if (!updatedMatch) {
      throw new Error('Failed to update match');
    }
    
    console.log('✅ UPDATE: Match updated to Live:', updatedMatch);

    // DELETE: Remove the match
    await db.delete(matches).where(eq(matches.id, newMatch.id));
    console.log('✅ DELETE: Match deleted.');

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool closed.');
    }
  }
}

main();
