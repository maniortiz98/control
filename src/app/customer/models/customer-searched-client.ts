import { CustomerFullNameClient } from './customer-client-data';

export interface CustomerSearchedClient extends CustomerFullNameClient{
  clientNumber: number,
  curp: string,
  rfc: string,
  birthDate: string,
}

export type SearchedClient = CustomerSearchedClient;


