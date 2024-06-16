import { z } from 'zod';
import type { Messages } from '@/database';

type Record = Messages;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().min(2).max(32),
  sprintId: z.coerce.number().int().positive(),
  templateId: z.coerce.number().int().positive(),
  createdAt: z.string(),
});

const requestSchema = schema
  .omit({
    id: true,
    sprintId: true,
    templateId: true,
    createdAt: true,
  })
  .extend({ sprintCode: z.string().length(6) });

const insertable = schema.omit({
  id: true,
  sprintCode: true,
  createdAt: true,
});

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseUsername = (username: unknown) =>
  schema.shape.username.parse(username);
export const parseSprintCode = (sprintCode: unknown) =>
  requestSchema.shape.sprintCode.parse(sprintCode);
export const parseRequest = (record: unknown) => requestSchema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
