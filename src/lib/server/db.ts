import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

const { Pool } = pkg;

const pool = new Pool({
	connectionString: DATABASE_URL
});

export const db = drizzle(pool, { schema });
