
export interface Nationalities {
  nationalityId: string;
  nationality: string;
}


export interface NationalityRequest {
  land: Array<string>;
}


export interface NationalityResponse {
  status: number;
  payload: {
    nationalities: Nationalities[];
  };
  messages: string[];
}
