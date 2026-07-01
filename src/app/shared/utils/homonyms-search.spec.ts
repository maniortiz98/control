
import { searchPercentSimilarity } from './homonyms-search';

describe('searchPercentSimilarity', () => {
  it('should return code 4 when array is empty', () => {
    const result = searchPercentSimilarity([]);
    expect(result).toEqual({ code: 4 });
  });

  it('should return code 1 and the index when exactly one item has percentSimilarity === 1', () => {
    const arr = [
      { percentSimilarity: 0.5 },
      { percentSimilarity: 1 },
      { percentSimilarity: 0.75 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result.code).toBe(1);
    expect(result).toEqual({ code: 1, indices: [1] });
  });

  it('should return code 1 and the index when exactly one item has percentSimilarity === 0.99', () => {
    const arr = [
      { percentSimilarity: 0.5 },
      { percentSimilarity: 0.99 },
      { percentSimilarity: 0.75 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result.code).toBe(1);
    expect(result).toEqual({ code: 1, indices: [1] });
  });

  it('should return code 2 and indices when more than one item equals 1 or 0.99', () => {
    const arr = [
      { percentSimilarity: 1 },
      { percentSimilarity: 0.99 },
      { percentSimilarity: 0.9 },
      { percentSimilarity: 1 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result.code).toBe(2);
    expect(result).toEqual({ code: 2, indices: [0, 1, 3] });
  });

  it('should return code 3 when array is not empty but no values are 1 or 0.99', () => {
    const arr = [
      { percentSimilarity: 0.98 },
      { percentSimilarity: 0.2 },
      { percentSimilarity: 0.5 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result).toEqual({ code: 3 });
  });

  it('should use strict equality for 0.99 (e.g., 0.9900001 should NOT match)', () => {
    const arr = [
      { percentSimilarity: 0.9900001 },
      { percentSimilarity: 0.9899999 },
      { percentSimilarity: 1.0000001 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result).toEqual({ code: 3 });
  });

  it('should preserve correct indices even with mixed values', () => {
    const arr = [
      { percentSimilarity: 0.99 }, // idx 0 match
      { percentSimilarity: 0.1 },
      { percentSimilarity: 1 },    // idx 2 match
      { percentSimilarity: 0.99 }, // idx 3 match
      { percentSimilarity: 0.8 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result.code).toBe(2);
    expect(result).toEqual({ code: 2, indices: [0, 2, 3] });
  });

  it('should ignore objects missing percentSimilarity or with null/undefined', () => {
    const arr = [
      { percentSimilarity: 1 },
      { other: 0.99 },       // sin campo esperado
      { percentSimilarity: null },
      { percentSimilarity: undefined },
      { percentSimilarity: 0.99 }
    ] as any[];

    const result = searchPercentSimilarity(arr);

    expect(result).toEqual({ code: 2, indices: [0, 4] });
  });

  it('should return code 1 if only one element equals 1 among decimals near 1', () => {
    const arr = [
      { percentSimilarity: 0.9999 },
      { percentSimilarity: 1 },
      { percentSimilarity: 0.9899 },
    ] as any[];

    const result = searchPercentSimilarity(arr);
    expect(result).toEqual({ code: 1, indices: [1] });
  });
});
