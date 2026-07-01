export interface CustomerLegalPowerInfo{
  id?: number,
  adminitration: boolean,
  domain: boolean,
  powerToDelegate: boolean,
  creditTitles: boolean,
  powerToOpenAccount: boolean,

  writingNumber: string,
  writingDate: Date,
  writingNotaryName: string,
  notaryNumber: string,
  protocalizationPlace: string,
  powerLimitations: string,
}



export type LegalPowerInfo = CustomerLegalPowerInfo;

