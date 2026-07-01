export interface CustomerOperateChangesSection {
  fxOperationReasonsId: number | null,
  fxOperationsDetailsId: number | null,
  metalChangeInversion: boolean,
  currencySellAndBuy: boolean,

  importAndExport: boolean,
  countrySender: string,
  countryReciber: string,

  resourceReception: boolean,
  resourceCountrySender: string,
  resourceCounteyReciber: string,

  liquidationSupplier: boolean,
  liquidationSupplierCountryDestiny: string,

  donation: boolean,
  donationCountrySender: string,
  donationCountryReciber: string,

  inversion: boolean,
  inversionCountrySender: string,
  inversionCountryReciber: string,

  liquidationOperation: boolean,
  liquidationOperationCountryReciber: string,

  clientPayment: boolean,
  clientPaymentCountrySender: string,

  cash: boolean,
  cashOperationNumber: string,
  cashOperationAmount: string,

  transfer: boolean,
  transferOperationNumber: string,
  transferOperationAmount: string,

  document: boolean,
  documentOperationNumber: string,
  documentOperationAmount: string,

  travelerCheck: boolean,
  travelerCheckOperationNumber: string,
  travelerCheckOperationAmount: string,

  gold: boolean,
  goldOperationNumber: string,
  goldOperationAmount: string,

  silver: boolean,
  silverOperationNumber: string,
  silverOperationAmount: string,

  other: boolean,
  otherType: string,
  otherOperationNumber: string,
  otherOperationAmount: string,
}

export type OperateChangesSection = CustomerOperateChangesSection;

