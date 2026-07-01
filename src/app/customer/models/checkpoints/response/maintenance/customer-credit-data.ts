export interface CustomerCreditData {
  generalData?: CustomerGeneralData | null;
  employmentData?: CustomerEmploymentData | null;
  active?: boolean | null;
}

export interface CustomerGeneralData {
  economicActivity?: string | null;
  economicSector?: string | null;
  accountType?: string | null;
  yearsOfOperation?: number | null;
  riskGroup?: string | null;
  numberOfEconomicDependents?: number | null;
}

export interface CustomerEmploymentData {
  hiringDate?: string | null;
  salaried?: boolean | null;
  salary?: number | null;
  paymentPeriod?: string | null;
  paymentCurrencyType?: string | null;
  employeeNumber?: string | null;
  socialSecurityNumber?: string | null;
}

export interface CustomerCreditDataM {
  generalData?: CustomerGeneralData | null;
  employmentData?: CustomerEmploymentData | null;
  active?: boolean | null;
}

export interface CustomerGeneralDataM {
  economicActivity?: string | null;
  economicSector?: string | null;
  accountType?: string | null;
  yearsOfOperation?: number | null;
  riskGroup?: string | null;
  numberOfEconomicDependents?: number | null;
}

export interface CustomerEmploymentDataM {
  hiringDate?: string | null;
  salaried?: boolean | null;
  salary?: number | null;
  paymentPeriod?: string | null;
  paymentCurrencyType?: string | null;
  employeeNumber?: string | null;
  socialSecurityNumber?: string | null;
}
export type CreditData = CustomerCreditData;
export type GeneralData = CustomerGeneralData;
export type EmploymentData = CustomerEmploymentData;
export type CreditDataM = CustomerCreditDataM;
export type GeneralDataM = CustomerGeneralDataM;
export type EmploymentDataM = CustomerEmploymentDataM;

