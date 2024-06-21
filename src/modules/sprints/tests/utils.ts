import type { Insertable } from 'kysely';
import type { Sprints } from '@/database';

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  code: 'wd-1.1',
  title: 'First Steps Into Programming with Python',
  ...overrides,
});

export const sprintMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeSprint(overrides),
});

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: 1,
  ...fakeSprint(overrides),
});
