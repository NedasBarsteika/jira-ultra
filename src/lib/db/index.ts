import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DB } from '@/types/db';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});
