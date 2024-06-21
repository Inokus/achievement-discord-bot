import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { fakeTemplate, templateMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'templates');
const selectAllTemplates = selectAllFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

afterAll(() => db.destroy());

describe('findAll', () => {
  it('should return an array of all templates', async () => {
    await createTemplates([
      fakeTemplate(),
      fakeTemplate({ content: 'you did it!' }),
    ]);

    const templates = await repository.findAll();

    expect(templates).toHaveLength(2);
    expect(templates).toEqual([
      templateMatcher(),
      templateMatcher({ content: 'you did it!' }),
    ]);
  });
});

describe('findById', () => {
  it('should return a template with matching id', async () => {
    const newTemplates = await createTemplates([
      fakeTemplate({ id: 3 }),
      fakeTemplate({ id: 45, content: 'you did it!' }),
    ]);

    const template = await repository.findById(45);

    expect(template).toEqual(templateMatcher(newTemplates[1]));
  });

  it('should return undefined if template with matching id is not found', async () => {
    const template = await repository.findById(1);

    expect(template).toBeUndefined();
  });
});

describe('create', () => {
  it('should add and return a new template', async () => {
    const newTemplate = await repository.create(fakeTemplate());
    const allTemplates = await selectAllTemplates();

    expect(newTemplate).toEqual(templateMatcher());
    expect(allTemplates).toHaveLength(1);
    expect(allTemplates[0]).toEqual(templateMatcher());
  });
});

describe('update', () => {
  it('should update and return updated template with matching id', async () => {
    const [newTemplate] = await createTemplates(fakeTemplate());

    const template = await repository.update(newTemplate.id, {
      content: 'you did it!',
    });

    const allTemplates = await selectAllTemplates();

    expect(template).toEqual(templateMatcher({ content: 'you did it!' }));
    expect(allTemplates[0]).toEqual(template);
  });

  it('should return unchanged template if there is no provided content', async () => {
    const [newTemplate] = await createTemplates(fakeTemplate());

    const template = await repository.update(newTemplate.id, {});

    expect(template).toEqual(newTemplate);
  });

  it('should return undefined if template with matching id is not found', async () => {
    const template = await repository.update(1, {});

    expect(template).toBeUndefined;
  });
});

describe('remove', () => {
  it('should delete and return a template with matching id', async () => {
    const [newTemplate] = await createTemplates(fakeTemplate());
    const allTemplatesBefore = await selectAllTemplates();

    expect(allTemplatesBefore.length).toBe(1);

    const template = await repository.remove(newTemplate.id);

    const allTemplatesAfter = await selectAllTemplates();

    expect(template).toEqual(templateMatcher());
    expect(allTemplatesAfter.length).toBe(0);
  });

  it('should return undefined if template with matching id is not found', async () => {
    const template = await repository.remove(1);

    expect(template).toBeUndefined;
  });
});
