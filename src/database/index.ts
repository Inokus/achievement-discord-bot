import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

const database = new Database(DATABASE_URL);
const dialect = new SqliteDialect({ database });

export default new Kysely({
  dialect,
  plugins: [new CamelCasePlugin()],
});
