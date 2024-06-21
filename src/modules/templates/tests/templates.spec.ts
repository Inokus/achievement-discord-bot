import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import discord from '@tests/utils/mockDiscord';
import giphy from '@tests/utils/mockGiphy';
import { createFor, selectAllFor } from '@tests/utils/records';
import { omit } from 'lodash/fp';
import { fakeTemplate, fakeTemplateFull, templateMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db, discord, giphy);
const createTemplates = createFor(db, 'templates');
const selectAllTemplates = selectAllFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

afterAll(() => db.destroy());

describe('get', () => {
  it('should return an empty array when there are no templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing templates', async () => {
    await createTemplates([
      fakeTemplate(),
      fakeTemplate({ content: 'you did it!' }),
    ]);

    const allTemplates = await selectAllTemplates();

    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual(allTemplates);
  });
});

describe('get /:id', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app).get('/templates/1').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return a template if it exists', async () => {
    const id = 1;
    await createTemplates(fakeTemplateFull());

    const { body } = await supertest(app).get(`/templates/${id}`).expect(200);

    expect(body).toEqual(templateMatcher({ id }));
  });
});

describe('post', () => {
  it('should return 400 if content is missing', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['content'], fakeTemplate()))
      .expect(400);

    expect(body.error.message).toMatch(/content/i);
  });

  it('should return 400 if content is empty', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate({ content: '' }))
      .expect(400);

    expect(body.error.message).toMatch(/content/i);
  });

  it('should return 201 and created template', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate())
      .expect(201);

    expect(body).toEqual(templateMatcher());
  });
});

describe('patch /:id', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/templates/1')
      .send(fakeTemplate())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should allow partial updates and persist changes', async () => {
    const id = 1;
    await createTemplates(fakeTemplateFull());

    const { body } = await supertest(app)
      .patch(`/templates/${id}`)
      .send({ content: 'Updated!' })
      .expect(200);

    const allTemplates = await selectAllTemplates();

    expect(body).toEqual(templateMatcher({ id, content: 'Updated!' }));
    expect(allTemplates[0]).toEqual(body);
  });
});

describe('delete /:id', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app).delete('/templates/1').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should delete and return deleted template', async () => {
    const id = 1;
    await createTemplates(fakeTemplateFull());

    const { body } = await supertest(app)
      .delete(`/templates/${id}`)
      .expect(200);

    expect(body).toEqual(templateMatcher({ id }));
  });
});
