import { Entity } from '../models/customer-entity';

export function searchState(id: string, dataState: any): string {
  const state = dataState;
  const data = state.find((dat: { bland: string; }) => dat.bland === id);
  return data ? data.bland : '';
}



