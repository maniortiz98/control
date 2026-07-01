import { Address } from "../address";

export interface ResourceProviderPm {
  socialReason: string,
  nacionatity: string,
  identityType: string,
  identityNumber: string,
  fiscalKeyCountry: string,
  fiscalKeyNumber: string,
  businessType: string,
  mail: string,
  phone: string
  address: Address | null;
}
