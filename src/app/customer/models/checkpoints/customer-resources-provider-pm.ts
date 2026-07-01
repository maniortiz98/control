import { CustomerAddress } from "../customer-address";

export interface CustomerResourceProviderPm {
  socialReason: string,
  nacionatity: string,
  identityType: string,
  identityNumber: string,
  fiscalKeyCountry: string,
  fiscalKeyNumber: string,
  businessType: string,
  mail: string,
  phone: string
  address: CustomerAddress | null;
}

export type ResourceProviderPm = CustomerResourceProviderPm;





