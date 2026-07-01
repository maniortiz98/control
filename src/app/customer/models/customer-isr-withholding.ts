export interface CustomerIsrWithholdingData {
  moneyMarket: boolean,
  dividends: boolean,
  fibers: boolean,
  mdFunds: boolean,
  contractType: number,
  contractSubtype: number,
  de: boolean,
  iva: boolean,
  isr: boolean,
}
export type IsrWithholdingData = CustomerIsrWithholdingData;

