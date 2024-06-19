import { z } from 'zod';
import type { Sprints } from '@/database';

type Record = Sprints;

const schema = z.object({
  id: z.coerce.number().int().positive(),
  code: z.string().length(6),
  title: z.string().min(6).max(60),
});

const insertable = schema.omit({
  id: true,
});
const partial = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
