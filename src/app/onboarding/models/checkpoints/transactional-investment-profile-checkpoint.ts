export interface TransactionalInvestmentProfileCheckpoint {
  // transactionalLimitId:    string;
  customerType:            string;
  customerSubtype:         string;
  investmentProfile:       string;
  // investmentQuestionnaire: InvestmentQuestionnaire;
  questionnaire:           Question[];
  originResource:          OriginResource[];
  manageInvestmentsVia:    string;
  salesPracticeRate: string,
  salesPracticeIdQuiz: string,
  salesPracticePersonType: string,
  maintenanceQuiz?: any,
}

export interface InvestmentQuestionnaire {
  dateOfBirth:        string;
  maritalStatus:      string;
  profession:         string;
  companyName:        string;
  position:           string;
  telephoneCompany:   string;
  companyWebsite:     string;
  question:           Question[];
  educationLevel:     string;
  occupation:         string;
  numberOfDependents: number;
  lineOfBusiness:     string;
}

export interface Question {
  idQuestion: string;
  idAnswer:   string;
}

export interface OriginResource {
  idOriginResource: string;
  percentage:       string;
}
