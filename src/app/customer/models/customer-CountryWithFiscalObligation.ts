export interface CustomerCountryWithFiscalObligation {
  id: string,
  registerNumber: number,
  fiscalResidence: string,
  fiscalResidenceId: string,
  ein: string,
  tin: string,
  nss: string,
}



export type CountryWithFiscalObligation = CustomerCountryWithFiscalObligation;

