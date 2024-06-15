import type { Insertable, Selectable, Updateable } from 'kysely';
import { keys } from './schema';
import db, { type Templates } from '@/database';

const TABLE = 'templates';
type Row = Templates;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export function findAll(): Promise<RowSelect[]> {
  return db.selectFrom(TABLE).select(keys).execute();
}

export function findById(id: number): Promise<RowSelect | undefined> {
  return db
    .selectFrom(TABLE)
    .select(keys)
    .where('id', '=', id)
    .executeTakeFirst();
}

export function create(record: RowInsert): Promise<RowSelect | undefined> {
  return db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst();
}

export function update(
  id: number,
  partial: RowUpdate
): Promise<RowSelect | undefined> {
  if (Object.keys(partial).length === 0) {
    return findById(id);
  }

  return db
    .updateTable(TABLE)
    .set(partial)
    .where('id', '=', id)
    .returning(keys)
    .executeTakeFirst();
}

export function remove(id: number) {
  return db
    .deleteFrom(TABLE)
    .where('id', '=', id)
    .returning(keys)
    .executeTakeFirst();
}
