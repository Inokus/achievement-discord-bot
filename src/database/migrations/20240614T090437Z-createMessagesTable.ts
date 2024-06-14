import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('username', 'text', (col) => col.notNull())
    .addColumn('sprint_id', 'integer', (col) =>
      col.references('sprints.id').notNull()
    )
    .addColumn('template_id', 'integer', (col) =>
      col.references('templates.id').notNull()
    )
    .addColumn('created_at', 'datetime', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').execute();
}
