import { omit } from 'lodash/fp';
import { parse, parseRequest, parseInsertable } from '../schema';
import { fakeMessage, fakeMessageFull } from './utils';

describe('parse', () => {
  it('should parse a valid record', () => {
    const record = fakeMessageFull();

    expect(parse(record)).toEqual(record);
  });

  it('should throw an error due to missing id', () => {
    const record = fakeMessage();

    expect(() => parse(record)).toThrow(/nan/i);
  });

  it('should throw an error due to id being 0 or negative', () => {
    const recordOne = fakeMessageFull({ id: 0 });
    const recordTwo = fakeMessageFull({ id: -1 });

    expect(() => parse(recordOne)).toThrow(/id/i);
    expect(() => parse(recordTwo)).toThrow(/id/i);
  });

  it('should throw an error due to empty/missing username', () => {
    const recordOne = omit(['username'], fakeMessageFull());
    const recordTwo = fakeMessageFull({ username: '' });

    expect(() => parse(recordOne)).toThrow(/username/i);
    expect(() => parse(recordTwo)).toThrow(/username/i);
  });

  it('should throw an error due to missing sprintId', () => {
    const record = omit(['sprintId'], fakeMessageFull());

    expect(() => parse(record)).toThrow(/sprintId/i);
  });

  it('should throw an error due to sprintId being 0 or negative', () => {
    const recordOne = fakeMessageFull({ sprintId: 0 });
    const recordTwo = fakeMessageFull({ sprintId: -1 });

    expect(() => parse(recordOne)).toThrow(/sprintId/i);
    expect(() => parse(recordTwo)).toThrow(/sprintId/i);
  });

  it('should throw an error due to missing templateId', () => {
    const record = omit(['templateId'], fakeMessageFull());

    expect(() => parse(record)).toThrow(/templateId/i);
  });

  it('should throw an error due to templateId being 0 or negative', () => {
    const recordOne = fakeMessageFull({ templateId: 0 });
    const recordTwo = fakeMessageFull({ templateId: -1 });

    expect(() => parse(recordOne)).toThrow(/templateId/i);
    expect(() => parse(recordTwo)).toThrow(/templateId/i);
  });

  it('should throw an error due to missing createdAt', () => {
    const record = omit(['createdAt'], fakeMessageFull());

    expect(() => parse(record)).toThrow(/createdAt/i);
  });
});

describe('parseRequest', () => {
  it('should omit id, sprintId, templateId, createdAt and include sprintCode ', () => {
    const record = {
      ...fakeMessageFull(),
      sprintCode: 'wd-1.1',
    };

    const parsed = parseRequest(record);

    expect(parsed).not.toHaveProperty([
      'id',
      'sprintId',
      'templateId',
      'createdAt',
    ]);
    expect(parsed).toHaveProperty('sprintCode');
  });
});

describe('parseInsertable', () => {
  it('should omit id and createdAt', () => {
    const parsed = parseInsertable(fakeMessageFull());

    expect(parsed).not.toHaveProperty(['id', 'createdAt']);
  });
});
