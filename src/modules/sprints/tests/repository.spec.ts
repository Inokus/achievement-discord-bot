import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { fakeSprint, sprintMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprints');
const selectAllSprints = selectAllFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterAll(() => db.destroy());

describe('findAll', () => {
  it('should return an array of all sprints', async () => {
    await createSprints([
      fakeSprint(),
      fakeSprint({
        code: 'wd-1.2',
        title: 'Intermediate Programming with Python',
      }),
    ]);

    const sprints = await repository.findAll();

    expect(sprints).toHaveLength(2);
    expect(sprints).toEqual([
      sprintMatcher(),
      sprintMatcher({
        code: 'wd-1.2',
        title: 'Intermediate Programming with Python',
      }),
    ]);
  });
});

describe('findByField', () => {
  it('should return a sprint with matching field', async () => {
    const newSprints = await createSprints([
      fakeSprint({
        id: 1,
      }),
      fakeSprint({
        id: 2,
        code: 'wd-1.2',
        title: 'Intermediate Programming with Python',
      }),
    ]);

    const sprintOne = await repository.findByField('code', 'wd-1.1');
    const sprintTwo = await repository.findByField('id', 2);

    expect(sprintOne).toEqual(sprintMatcher(newSprints[0]));
    expect(sprintTwo).toEqual(sprintMatcher(newSprints[1]));
  });

  it('should return undefined if sprint with matching field is not found', async () => {
    const sprintOne = await repository.findByField('code', 'wd-1.1');
    const sprintTwo = await repository.findByField('id', 2);

    expect(sprintOne).toBeUndefined();
    expect(sprintTwo).toBeUndefined();
  });
});

describe('create', () => {
  it('should add and return a new sprint', async () => {
    const newSprint = await repository.create(fakeSprint());
    const allSprints = await selectAllSprints();

    expect(newSprint).toEqual(sprintMatcher());
    expect(allSprints).toHaveLength(1);
    expect(allSprints[0]).toEqual(sprintMatcher());
  });
});

describe('update', () => {
  it('should update and return updated sprint with matching id', async () => {
    const newSprints = await createSprints([
      fakeSprint(),
      fakeSprint({ code: 'wd-1.2' }),
    ]);

    const sprintOne = await repository.update(newSprints[0].id, {
      code: 'wd-1.3',
    });
    const sprintTwo = await repository.update(newSprints[1].id, {
      title: 'Object Oriented Programming',
    });

    const allSprints = await selectAllSprints();

    expect(sprintOne).toEqual(sprintMatcher({ code: 'wd-1.3' }));
    expect(sprintTwo).toEqual(
      sprintMatcher({ code: 'wd-1.2', title: 'Object Oriented Programming' })
    );
    expect(allSprints[0]).toEqual(sprintOne);
    expect(allSprints[1]).toEqual(sprintTwo);
  });

  it('should return unchanged sprint if there is no provided code or title', async () => {
    const [newSprint] = await createSprints(fakeSprint());

    const sprint = await repository.update(newSprint.id, {});

    expect(sprint).toEqual(newSprint);
  });

  it('should return undefined if sprint with matching id is not found', async () => {
    const sprint = await repository.update(1, {});

    expect(sprint).toBeUndefined;
  });
});

describe('remove', () => {
  it('should delete and return a sprint with matching id', async () => {
    const [newSprint] = await createSprints(fakeSprint());
    const allSprintsBefore = await selectAllSprints();

    expect(allSprintsBefore.length).toBe(1);

    const sprint = await repository.remove(newSprint.id);

    const allSprintsAfter = await selectAllSprints();

    expect(sprint).toEqual(sprintMatcher());
    expect(allSprintsAfter.length).toBe(0);
  });

  it('should return undefined if sprint with matching id is not found', async () => {
    const sprint = await repository.remove(1);

    expect(sprint).toBeUndefined;
  });
});
