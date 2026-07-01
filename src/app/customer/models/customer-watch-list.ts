export interface CustomerWatchList {
  matchLists?: any[];
  step?: any;

  fullName: string,
  birthDate: string,
  rfc: string,
  curp: string,
  nif: string,
  clientNumber: string,
  ssn: string;
  personType: string;
  name: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  gender: string;
  countryOfBirth: string;
  federalEntity: string;
}

export interface CustomerWatchListReturn extends CustomerWatchList{
  passOnWatchlist: boolean;
}

export interface CustomerWatchListBody {
  personalInfo: CustomerWatchList;
  customerId?: string | null;
  accountId?: string | null;
}

export interface CustomerWatchListResponse {
  status: number;
  messages: string[];
  payload: CustomerWatchList;
}

export interface CustomerMatchLists {
  companyName: string;
  name: string;
  lastname: string;
  secondLastName: string;
  tin: number;
  curp: string;
  type: string;
  matchPercentage: number;
  personStatus: number;
}

export type WatchList = CustomerWatchList;

export type WatchListReturn = CustomerWatchListReturn;
export type WatchListBody = CustomerWatchListBody;
export type WatchListResponse = CustomerWatchListResponse;
export type MatchLists = CustomerMatchLists;

