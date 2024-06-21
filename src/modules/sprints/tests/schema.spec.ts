import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeSprint, fakeSprintFull } from './utils';

describe('parse', () => {
  it('should parse a valid record', () => {
    const record = fakeSprintFull();

    expect(parse(record)).toEqual(record);
  });

  it('should throw an error due to missing id', () => {
    const record = fakeSprint();

    expect(() => parse(record)).toThrow(/nan/i);
  });

  it('should throw an error due to id being 0 or negative', () => {
    const recordOne = fakeSprint({ id: 0 });
    const recordTwo = fakeSprint({ id: -1 });

    expect(() => parse(recordOne)).toThrow(/id/i);
    expect(() => parse(recordTwo)).toThrow(/id/i);
  });

  it('should throw an error due to empty/missing code', () => {
    const recordOne = omit(['code'], fakeSprintFull());
    const recordTwo = fakeSprintFull({ code: '' });

    expect(() => parse(recordOne)).toThrow(/code/i);
    expect(() => parse(recordTwo)).toThrow(/code/i);
  });

  it('should throw an error due to code being too short', () => {
    const record = fakeSprintFull({ code: 'wd-1' });

    expect(() => parse(record)).toThrow(/code/i);
  });

  it('should throw an error due to code being too long', () => {
    const record = fakeSprintFull({ code: 'wd-1.1.1' });

    expect(() => parse(record)).toThrow(/code/i);
  });

  it('should throw an error due to empty/missing title', () => {
    const recordOne = omit(['title'], fakeSprintFull());
    const recordTwo = fakeSprintFull({ title: '' });

    expect(() => parse(recordOne)).toThrow(/title/i);
    expect(() => parse(recordTwo)).toThrow(/title/i);
  });

  it('should throw an error due to title being too short', () => {
    const record = fakeSprintFull({ title: 'First' });

    expect(() => parse(record)).toThrow(/title/i);
  });

  it('should throw an error due to title being too long', () => {
    const record = fakeSprintFull({
      title:
        'Exploring the Basics: Your First Steps Into Programming with Python',
    });

    expect(() => parse(record)).toThrow(/title/i);
  });
});

describe('parseInsertable', () => {
  it('should omit id', () => {
    const parsed = parseInsertable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('should omit id', () => {
    const parsed = parseUpdateable(fakeSprintFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
