export interface CustomerTaxProfileSignal {
  id: number;
  personTypeCve?: string;
  collectTaxes: boolean;
  trust?: boolean;
  subPersonTypeCve?: string;
  taxProfile?: string;
  taxProfileDescription?: string;
}


export type TaxProfileSignal = CustomerTaxProfileSignal;

