import { searchPercentSimilarity } from './customer-homonyms-search';

describe('searchPercentSimilarity', () => {

  const buildItem = (value: number) => ({
    percentSimilarity: value
  } as any);

  it('code 4 cuando lista vacía', () => {
    const result = searchPercentSimilarity([]);
    expect(result).toEqual({ code: 4 });
  });

  it('code 1 cuando hay un match exacto', () => {
    const data = [
      buildItem(0.5),
      buildItem(1),
      buildItem(0.2)
    ];

    const result = searchPercentSimilarity(data);

    expect(result.code).toBe(1);

    if (result.code === 1 || result.code === 2) {
      expect(result.indices).toEqual([1]);
    }
  });

  it('code 1 cuando hay un match con 0.99', () => {
    const data = [
      buildItem(0.5),
      buildItem(0.99),
      buildItem(0.2)
    ];

    const result = searchPercentSimilarity(data);

    expect(result.code).toBe(1);

    if (result.code === 1 || result.code === 2) {
      expect(result.indices).toEqual([1]);
    }
  });

  it('code 2 cuando hay múltiples matches', () => {
    const data = [
      buildItem(1),
      buildItem(0.99),
      buildItem(0.2)
    ];

    const result = searchPercentSimilarity(data);

    expect(result.code).toBe(2);

    if (result.code === 2) {
      expect(result.indices).toEqual([0, 1]);
    }
  });

  it('code 3 cuando no hay matches', () => {
    const data = [
      buildItem(0.5),
      buildItem(0.8),
      buildItem(0.97)
    ];

    const result = searchPercentSimilarity(data);

    expect(result).toEqual({ code: 3 });
  });

  it('considera 1.0 como válido', () => {
    const data = [
      buildItem(1.0)
    ];

    const result = searchPercentSimilarity(data);

    expect(result.code).toBe(1);

    if (result.code === 1 || result.code === 2) {
      expect(result.indices).toEqual([0]);
    }
  });

});