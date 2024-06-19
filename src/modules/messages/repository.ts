import { keys } from './schema';
import type { Insertable, Selectable } from 'kysely';
import type { Database, Messages } from '@/database';

const TABLE = 'messages';
type Row = Messages;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  async findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  async findAllByField(
    fieldName: 'sprintId' | 'username',
    value: number | string
  ): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where(fieldName, '=', value)
      .execute();
  },

  async findByUsernameAndSprint(
    username: string,
    sprintId: number
  ): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('username', '=', username)
      .where('sprintId', '=', sprintId)
      .executeTakeFirst();
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },
});
