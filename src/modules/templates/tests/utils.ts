import type { Insertable } from 'kysely';
import type { Templates } from '@/database';

export const fakeTemplate = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  content: 'congratulations!',
  ...overrides,
});

export const templateMatcher = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeTemplate(overrides),
});

export const fakeTemplateFull = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: 1,
  ...fakeTemplate(overrides),
});
