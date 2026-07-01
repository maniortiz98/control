export interface CustomerIsrWithholding {
  typePerson: number;
  contractTypeId: number;
  subContractTypeId: number;
  moneyMarket: Data,
  dividends: Data,
  fibers: Data,
  mdFunds: Data,
  de: Data,
  iva: Data,
  isr: Data,
}

interface Data {
  editable: boolean,
  value: boolean
}
export type IsrWithholding = CustomerIsrWithholding;

