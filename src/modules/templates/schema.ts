import { z } from 'zod';
import type { Templates } from '@/database';

type Record = Templates;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  content: z.string().min(5).max(500),
});

const insertable = schema.omit({
  id: true,
});
const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
