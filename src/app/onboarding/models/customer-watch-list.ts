export interface CustomerWatchList {
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

export interface WatchList {
    isOnWatchlist: boolean;
    step: number;
    matchLists: MatchLists[];
    workflowApplicationNumber?: number
}

export interface WatchListReturn extends WatchList{
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
  payload: WatchList;
}

export interface MatchLists {
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
