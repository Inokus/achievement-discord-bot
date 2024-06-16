import type { Insertable, Selectable } from 'kysely';
import { keys } from './schema';
import db, { type Messages } from '@/database';

const TABLE = 'messages';
type Row = Messages;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export function findAll(): Promise<RowSelect[]> {
  return db.selectFrom(TABLE).select(keys).execute();
}

export function findAllByField(
  fieldName: 'sprintId' | 'username',
  value: number | string
): Promise<RowSelect[]> {
  return db
    .selectFrom(TABLE)
    .select(keys)
    .where(fieldName, '=', value)
    .execute();
}

export function create(record: RowInsert): Promise<RowSelect | undefined> {
  return db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst();
}
