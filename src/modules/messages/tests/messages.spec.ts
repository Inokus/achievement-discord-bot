import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import discord from '@tests/utils/mockDiscord';
import giphy from '@tests/utils/mockGiphy';
import { createFor, selectAllFor } from '@tests/utils/records';
import { omit } from 'lodash/fp';
import { fakeMessage, fakeMessageFull, messageMatcher } from './utils';
import { fakeSprintFull } from '@/modules/sprints/tests/utils';
import {
  fakeTemplate,
  fakeTemplateFull,
} from '@/modules/templates/tests/utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db, discord, giphy);
const createMessages = createFor(db, 'messages');
const selectAllMessages = selectAllFor(db, 'messages');
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');

beforeEach(async () => {
  await createSprints([
    fakeSprintFull(),
    fakeSprintFull({ id: 2, code: 'wd-1.2' }),
  ]);

  await createTemplates([
    fakeTemplateFull(),
    fakeTemplateFull({
      id: 2,
      content: 'Intermediate Programming with Python',
    }),
  ]);
});

afterEach(async () => {
  await db.deleteFrom('messages').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
});

afterAll(() => db.destroy());

describe('get', () => {
  it('should return an empty array when there are no messages', async () => {
    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing messages', async () => {
    await createMessages([
      fakeMessage(),
      fakeMessage({ sprintId: 2, templateId: 2, username: 'bob' }),
    ]);

    const allMessages = await selectAllMessages();

    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual(allMessages);
  });
});

describe('get ?username=', () => {
  it('should return 404 if messages with specified username does not exist', async () => {
    const { body } = await supertest(app)
      .get('/messages?username=john')
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return an array of messages with specified username', async () => {
    await createMessages([
      fakeMessage(),
      fakeMessage({ sprintId: 2, templateId: 2 }),
      fakeMessage({ username: 'bob' }),
    ]);

    const { body } = await supertest(app)
      .get(`/messages?username=john`)
      .expect(200);

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({ sprintId: 2, templateId: 2 }),
    ]);
  });
});

describe('get ?sprintCode=', () => {
  it('should return 404 if messages with specified sprint does not exist', async () => {
    const { body } = await supertest(app)
      .get('/messages?sprint=wd-1.3')
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return an array of messages with specified sprint', async () => {
    await createMessages([
      fakeMessage(),
      fakeMessage({ username: 'bob' }),
      fakeMessage({ sprintId: 2, templateId: 2 }),
    ]);

    const { body } = await supertest(app)
      .get(`/messages?sprint=wd-1.1`)
      .expect(200);

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({ username: 'bob' }),
    ]);
  });
});

describe('post', () => {
  it('should return 400 if username is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ sprintCode: 'wd-1.1' })
      .expect(400);

    expect(body.error.message).toMatch(/username/i);
  });

  it('should return 400 if sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'john' })
      .expect(400);

    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('should return 400 if username is empty', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: '', sprintCode: 'wd-1.1' })
      .expect(400);

    expect(body.error.message).toMatch(/username/i);
  });

  it('should return 400 if sprintCode is empty', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'john', sprintCode: '' })
      .expect(400);

    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('should return 404 if username does not exist', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'mike', sprintCode: 'wd-1.1' })
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return 404 if sprintCode does not exist', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'john', sprintCode: 'wd-1.3' })
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return 409 if user has already finished the sprint', async () => {
    await createMessages(fakeMessage());

    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'john', sprintCode: 'wd-1.1' })
      .expect(409);

    expect(body.error.message).toMatch(/finished/i);
  });

  it('should return 201 and created message', async () => {
    await db.deleteFrom('templates').execute();
    await createTemplates(fakeTemplate());

    const { body } = await supertest(app)
      .post('/messages')
      .send({ username: 'john', sprintCode: 'wd-1.1' })
      .expect(201);

    expect(body).toEqual(messageMatcher({ templateId: 3 }));
  });
});
