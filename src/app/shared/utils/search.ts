/**
 * Finds an object in an array by a given field and value.
 * @param id - The value to search for.
 * @param items - The array of objects to search in.
 * @param key - The name of the field to match against.
 * @returns The matched object or `undefined` if not found.
 */
export function findObjectById<T>(id: T[keyof T], items: T[], key: keyof T): T | undefined {
  return items.find((item) => item[key] === id);
}

// export function getSpecificValueById<T>(id: T[keyof T], items: T[], key: keyof T): T | undefined {
//   return items.find((item) => item[key] === id);
// }
