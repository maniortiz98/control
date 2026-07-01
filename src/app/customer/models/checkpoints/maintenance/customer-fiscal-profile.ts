export interface CustomerTaxProfile {
  id: number;
  personTypeCve?: string;
  collectTaxes: boolean;
  trust?: boolean;
  subPersonTypeCve?: string;
  taxProfile?: string;
  taxProfileDescription?: string;
}



export type TaxProfile = CustomerTaxProfile;

