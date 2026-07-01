export interface CustomerCurrencyType {
  currencyTypeId: string;
  description: string;
}

export interface CustomerCurrencyTypeRequest {
  currencyTypeIds: string[];
}
export type CurrencyType = CustomerCurrencyType;
export type CurrencyTypeRequest = CustomerCurrencyTypeRequest;

