export interface CustomerTransactionalInvestmentProfileCheckpoint {
  // transactionalLimitId:    string;
  customerType:            string;
  customerSubtype:         string;
  investmentProfile:       string;
  // investmentQuestionnaire: CustomerInvestmentQuestionnaire;
  questionnaire:           CustomerQuestion[];
  originResource:          CustomerOriginResource[];
  manageInvestmentsVia:    string;
  salesPracticeRate: string,
  salesPracticeIdQuiz: string,
  salesPracticePersonType: string,
  maintenanceQuiz?: any,
}

export interface CustomerInvestmentQuestionnaire {
  dateOfBirth:        string;
  maritalStatus:      string;
  profession:         string;
  companyName:        string;
  position:           string;
  telephoneCompany:   string;
  companyWebsite:     string;
  question:           CustomerQuestion[];
  educationLevel:     string;
  occupation:         string;
  numberOfDependents: number;
  lineOfBusiness:     string;
}

export interface CustomerQuestion {
  idQuestion: string;
  idAnswer:   string;
}

export interface CustomerOriginResource {
  idOriginResource: string;
  percentage:       string;
}

export type TransactionalInvestmentProfileCheckpoint = CustomerTransactionalInvestmentProfileCheckpoint;
export type InvestmentQuestionnaire = CustomerInvestmentQuestionnaire;
export type Question = CustomerQuestion;
export type OriginResource = CustomerOriginResource;

