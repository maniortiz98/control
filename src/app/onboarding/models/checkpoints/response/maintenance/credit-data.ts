export interface CreditData {
  generalData?: GeneralData | null;
  employmentData?: EmploymentData | null;
  active?: boolean | null;
}

export interface GeneralData {
  economicActivity?: string | null;
  economicSector?: string | null;
  accountType?: string | null;
  yearsOfOperation?: number | null;
  riskGroup?: string | null;
  numberOfEconomicDependents?: number | null;
}

export interface EmploymentData {
  hiringDate?: string | null;
  salaried?: boolean | null;
  salary?: number | null;
  paymentPeriod?: string | null;
  paymentCurrencyType?: string | null;
  employeeNumber?: string | null;
  socialSecurityNumber?: string | null;
}

export interface CreditDataM {
  generalData?: GeneralData | null;
  employmentData?: EmploymentData | null;
  active?: boolean | null;
}

export interface GeneralDataM {
  economicActivity?: string | null;
  economicSector?: string | null;
  accountType?: string | null;
  yearsOfOperation?: number | null;
  riskGroup?: string | null;
  numberOfEconomicDependents?: number | null;
}

export interface EmploymentDataM {
  hiringDate?: string | null;
  salaried?: boolean | null;
  salary?: number | null;
  paymentPeriod?: string | null;
  paymentCurrencyType?: string | null;
  employeeNumber?: string | null;
  socialSecurityNumber?: string | null;
}