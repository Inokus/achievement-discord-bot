import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import discord from '@tests/utils/mockDiscord';
import giphy from '@tests/utils/mockGiphy';
import { createFor, selectAllFor } from '@tests/utils/records';
import { omit } from 'lodash/fp';
import { fakeSprint, fakeSprintFull, sprintMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db, discord, giphy);
const createSprints = createFor(db, 'sprints');
const selectAllSprints = selectAllFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterAll(() => db.destroy());

describe('get', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing sprints', async () => {
    await createSprints([fakeSprint(), fakeSprint({ code: 'wd-1.2' })]);

    const allSprints = await selectAllSprints();

    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual(allSprints);
  });
});

describe('get /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).get('/sprints/1').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return a sprint if it exists', async () => {
    const id = 1;
    await createSprints(fakeSprintFull());

    const { body } = await supertest(app).get(`/sprints/${id}`).expect(200);

    expect(body).toEqual(sprintMatcher({ id }));
  });
});

describe('post', () => {
  it('should return 400 if code is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['code'], fakeSprint()))
      .expect(400);

    expect(body.error.message).toMatch(/code/i);
  });

  it('should return 400 if code is empty', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({ code: '' }))
      .expect(400);

    expect(body.error.message).toMatch(/code/i);
  });

  it('should return 400 if title is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['title'], fakeSprint()))
      .expect(400);

    expect(body.error.message).toMatch(/title/i);
  });

  it('should return 400 if title is empty', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({ title: '' }))
      .expect(400);

    expect(body.error.message).toMatch(/title/i);
  });

  it('should return 201 and created sprint', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint())
      .expect(201);

    expect(body).toEqual(sprintMatcher());
  });
});

describe('patch /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/1')
      .send(fakeSprint())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should allow partial updates and persist changes', async () => {
    const id = 1;
    await createSprints(fakeSprintFull());

    const { body } = await supertest(app)
      .patch(`/sprints/${id}`)
      .send({ title: 'Updated!' })
      .expect(200);

    const allSprints = await selectAllSprints();

    expect(body).toEqual(sprintMatcher({ id, title: 'Updated!' }));
    expect(allSprints[0]).toEqual(body);
  });
});

describe('delete /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).delete('/sprints/1').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should delete and return deleted sprint', async () => {
    const id = 1;
    await createSprints(fakeSprintFull());

    const { body } = await supertest(app).delete(`/sprints/${id}`).expect(200);

    expect(body).toEqual(sprintMatcher({ id }));
  });
});
