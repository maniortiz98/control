export interface Countries {
  country: string;
  countryId: string;
  countryCode: string|null;
}

export interface CountryRequest {
  land: string[];
}

export interface CountryResponse {
  status: number;
  payload: {
    countries: Countries[];
  };
  messages: string[];
}