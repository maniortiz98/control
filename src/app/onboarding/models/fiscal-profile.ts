export interface TaxProfileSignal {
  id: number;
  personTypeCve?: string;
  collectTaxes: boolean;
  trust?: boolean;
  subPersonTypeCve?: string;
  taxProfile?: string;
  taxProfileDescription?: string;
}