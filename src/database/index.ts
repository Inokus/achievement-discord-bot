import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import type { DB } from './types';

export * from './types';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

const database = new Database(DATABASE_URL);
const dialect = new SqliteDialect({ database });

export default new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
