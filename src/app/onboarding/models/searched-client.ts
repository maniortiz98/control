import { FullNameClient } from "./client-data";

export interface SearchedClient extends FullNameClient{
  clientNumber: number,
  curp: string,
  rfc: string,
  birthDate: string,
}
