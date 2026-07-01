import { HomonymsResponse } from "../../onboarding/models/homonyms";

type SearchResult =
  | { code: 1; indices: number[] }
  | { code: 2; indices: number[] }
  | { code: 3 }
  | { code: 4 };

export function searchPercentSimilarity(arr: HomonymsResponse []): SearchResult {
  if (arr.length === 0) {
    return { code: 4 }; // Lista vacía
  }

  const indices = arr.reduce((acc, item, index) => {
    if (item.percentSimilarity === 1 || item.percentSimilarity === 1.0 || item.percentSimilarity === 0.99) {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);

  if (indices.length === 1) {
    return { code: 1, indices }; // Encontrado con percentSimilarity === 1 o 0.99
  }else  if (indices.length > 1) {
    return { code: 2, indices }; // Encontrados con percentSimilarity === 1 o 0.99
  }

  return { code: 3 }; // No encontrado con percentSimilarity === 1 o 0.99, pero lista no vacía
}

