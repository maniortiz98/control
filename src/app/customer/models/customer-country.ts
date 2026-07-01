export interface CustomerCountries {
  country: string;
  countryId: string;
  countryCode: string|null;
}

export interface CustomerCountryRequest {
  land: string[];
}

export interface CustomerCountryResponse {
  status: number;
  payload: {
    countries: CustomerCountries[];
  };
  messages: string[];
}
export type Countries = CustomerCountries;
export type CountryRequest = CustomerCountryRequest;
export type CountryResponse = CustomerCountryResponse;

