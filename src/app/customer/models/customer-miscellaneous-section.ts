export interface CustomerMiscellaneousInfo {
  relationship: string | null,
  economicActivity: string,
  occupation: string,
  profession?: string,

  workCompany?: string,
  positionHeld?: string,
  phoneBusiness?: string,

  fiscalCountry: string,
  //fiscalIdentificationNumber: string,

  ipabTitularityPercent: number,
  retentionIsr: number,
  signClass: string,
}

export type MiscellaneousInfo = CustomerMiscellaneousInfo;

