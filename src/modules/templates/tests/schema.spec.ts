import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { fakeTemplate, fakeTemplateFull } from './utils';

describe('parse', () => {
  it('should parse a valid record', () => {
    const record = fakeTemplateFull();

    expect(parse(record)).toEqual(record);
  });

  it('should throw an error due to missing id', () => {
    const record = fakeTemplate();

    expect(() => parse(record)).toThrow(/nan/i);
  });

  it('should throw an error due to id being 0 or negative', () => {
    const recordOne = fakeTemplate({ id: 0 });
    const recordTwo = fakeTemplate({ id: -1 });

    expect(() => parse(recordOne)).toThrow(/id/i);
    expect(() => parse(recordTwo)).toThrow(/id/i);
  });

  it('should throw an error due to empty/missing content', () => {
    const recordOne = omit(['content'], fakeTemplateFull());
    const recordTwo = fakeTemplateFull({ content: '' });

    expect(() => parse(recordOne)).toThrow(/content/i);
    expect(() => parse(recordTwo)).toThrow(/content/i);
  });

  it('should throw an error due to content being too short', () => {
    const record = fakeTemplateFull({ content: 'wow!' });

    expect(() => parse(record)).toThrow(/content/i);
  });

  it('should throw an error due to content being too long', () => {
    const record = fakeTemplateFull({
      content: `Congratulations on completing your sprint! Your dedication and hard work have truly paid off. 
        Each step you took has brought you closer to your goals, and it's inspiring to see your progress. 
        Celebrate this achievement and take pride in all you've learned. Remember, this is just the beginning 
        of an amazing journey. Keep pushing forward with the same enthusiasm and determination. You have shown 
        that with focus and effort, you can achieve great things. Here's to many more successes and milestones 
        in the future! Well done!`,
    });

    expect(() => parse(record)).toThrow(/content/i);
  });
});

describe('parseInsertable', () => {
  it('should omit id', () => {
    const parsed = parseInsertable(fakeTemplateFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('should omit id', () => {
    const parsed = parseUpdateable(fakeTemplateFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
