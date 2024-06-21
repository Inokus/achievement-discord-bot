import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { fakeMessage, messageMatcher } from './utils';
import { fakeSprintFull } from '@/modules/sprints/tests/utils';
import { fakeTemplateFull } from '@/modules/templates/tests/utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
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

describe('findAll', () => {
  it('should return an array of all messages', async () => {
    await createMessages([
      fakeMessage(),
      fakeMessage({
        sprintId: 2,
        templateId: 2,
        username: 'bob',
      }),
    ]);

    const messages = await repository.findAll();

    expect(messages).toHaveLength(2);
    expect(messages).toEqual([
      messageMatcher(),
      messageMatcher({
        sprintId: 2,
        templateId: 2,
        username: 'bob',
      }),
    ]);
  });
});

describe('findAllByField', () => {
  it('should return all messages with matching field', async () => {
    const newMessages = await createMessages([
      fakeMessage(),
      fakeMessage({
        sprintId: 2,
        templateId: 2,
        username: 'bob',
      }),
    ]);

    const [messageOne] = await repository.findAllByField('sprintId', '2');
    const [messageTwo] = await repository.findAllByField('username', 'john');

    expect(messageOne).toEqual(messageMatcher(newMessages[1]));
    expect(messageTwo).toEqual(messageMatcher(newMessages[0]));
  });

  it('should return empty an array if messages with matching field are not found', async () => {
    const messageOne = await repository.findAllByField('sprintId', '2');
    const messageTwo = await repository.findAllByField('username', 'john');

    expect(messageOne).toEqual([]);
    expect(messageTwo).toEqual([]);
  });
});

describe('findByUsernameAndSprint', () => {
  it('should return a message with matching username and sprint', async () => {
    const newMessages = await createMessages([
      fakeMessage(),
      fakeMessage({
        sprintId: 2,
        templateId: 2,
        username: 'bob',
      }),
    ]);

    const messageOne = await repository.findByUsernameAndSprint('bob', 2);
    const messageTwo = await repository.findByUsernameAndSprint('john', 1);

    expect(messageOne).toEqual(messageMatcher(newMessages[1]));
    expect(messageTwo).toEqual(messageMatcher(newMessages[0]));
  });

  it('should return undefined if message with matching username and sprint is not found', async () => {
    const messageOne = await repository.findByUsernameAndSprint('bob', 2);
    const messageTwo = await repository.findByUsernameAndSprint('john', 1);

    expect(messageOne).toBeUndefined;
    expect(messageTwo).toBeUndefined;
  });
});

describe('create', () => {
  it('should add and return a new message', async () => {
    const newMessage = await repository.create(fakeMessage());
    const allMessages = await selectAllMessages();

    expect(newMessage).toEqual(messageMatcher());
    expect(allMessages).toHaveLength(1);
    expect(allMessages[0]).toEqual(messageMatcher());
  });
});
