export interface SuburbItem {
  zipCode: string;
  idSuburb: string;
  suburb: string;
  centerRep: string;
}

interface ListSuburb {
  item: SuburbItem[];
}

interface Result {
  result: string;
  messages: string[];
}

export interface ZipCode {
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

export interface ZipCodeRequest {
  zipCode: string;
}

export interface ZipCodeResponse {
  status: number;
  payload: ZipCode;
  messages: string[];
}