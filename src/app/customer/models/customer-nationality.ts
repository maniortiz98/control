
export interface CustomerNationalities {
  nationalityId: string;
  nationality: string;
}


export interface CustomerNationalityRequest {
  land: Array<string>;
}


export interface CustomerNationalityResponse {
  status: number;
  payload: {
    nationalities: CustomerNationalities[];
  };
  messages: string[];
}

export type Nationalities = CustomerNationalities;
export type NationalityRequest = CustomerNationalityRequest;
export type NationalityResponse = CustomerNationalityResponse;

