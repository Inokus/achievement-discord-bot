import type { Insertable } from 'kysely';
import type { Messages } from '@/database';

export const fakeMessage = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  username: 'john',
  sprintId: 1,
  templateId: 1,
  ...overrides,
});

export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  createdAt: expect.any(String),
  ...overrides,
  ...fakeMessage(overrides),
});

export const fakeMessageFull = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: 1,
  createdAt: '2024-06-19 00:00:00',
  ...fakeMessage(overrides),
});
