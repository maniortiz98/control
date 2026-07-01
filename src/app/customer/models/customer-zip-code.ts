export interface CustomerSuburbItem {
  zipCode: string;
  idSuburb: string;
  suburb: string;
  centerRep: string;
}

interface ListSuburb {
  item: CustomerSuburbItem[];
}

interface Result {
  result: string;
  messages: string[];
}

export interface CustomerZipCode {
  city: string;
  cityDesc: string;
  federalEntityId: string;
  federalEntity: string;
  listSuburb: ListSuburb;
  result: Result;
  town: string;
  townDesc: string;
  zoneGeo: string;
}

export interface CustomerZipCodeRequest {
  zipCode: string;
}

export interface CustomerZipCodeResponse {
  status: number;
  payload: CustomerZipCode;
  messages: string[];
}
export type SuburbItem = CustomerSuburbItem;
export type ZipCode = CustomerZipCode;
export type ZipCodeRequest = CustomerZipCodeRequest;
export type ZipCodeResponse = CustomerZipCodeResponse;

