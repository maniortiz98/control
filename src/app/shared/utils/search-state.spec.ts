import { searchState } from "./search-state";

describe('searchState', () => {

  it('should return the matching bland value when id exists', () => {
    const dataState = [
      { bland: 'ABC' },
      { bland: 'XYZ' },
      { bland: '123' }
    ];

    const result = searchState('XYZ', dataState);

    expect(result).toBe('XYZ');
  });

  it('should return an empty string when id does not exist', () => {
    const dataState = [
      { bland: 'AAA' },
      { bland: 'BBB' }
    ];

    const result = searchState('CCC', dataState);

    expect(result).toBe('');
  });

  it('should return empty string when dataState is empty', () => {
    const result = searchState('ABC', []);

    expect(result).toBe('');
  });

  it('should work even if objects contain extra fields', () => {
    const dataState = [
      { bland: 'A1', name: 'test1' },
      { bland: 'B2', name: 'test2' },
      { bland: 'C3', another: 123 }
    ];

    const result = searchState('C3', dataState);

    expect(result).toBe('C3');
  });

});
``