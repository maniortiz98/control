
export interface CustomerTransactionalInvestmentProfileCheckpointMant {
  customerType:            string;
  customerSubtype:         string;
  investmentProfile:       string;
  // investmentQuestionnaire: CustomerInvestmentQuestionnaire;
  questionnaire:           CustomerQuestionnaire[];
  originResource:          CustomerOrgignResourceCheckpoint[];
  manageInvestmentsVia:    string;
  salesPracticeRate:       string;
  salesPracticeIdQuiz:     string;
  salesPracticePersonType: string;
  practicaVentaId?:         number | null;
  // transactionalLimitId:    string;
  sofclient:               boolean,
  marcoGeneral:            boolean,
  globalFront:             boolean,
  clientInst:              boolean,
  clientInstPub:           boolean,
  titularName:             string,
  adendum:                 boolean,
  cobroAsset:              boolean,
  clientInstNot:           boolean,
  clientFidu:              boolean,
}

export interface CustomerInvestmentQuestionnaire {
  dateOfBirth:        string;
  maritalStatus:      string;
  profession:         string;
  companyName:        string;
  position:           string;
  telephoneCompany:   string;
  companyWebsite:     string;
  question:           CustomerQuestionnaire[];
  educationLevel:     string;
  occupation:         string;
  numberOfDependents: number;
  lineOfBusiness:     string;
  workDataId:         number;
}


export interface CustomerQuestionnaire {
  idQuestion: string;
  idAnswer:   string;
}

export interface CustomerOrgignResourceCheckpoint{
  idOrigin: number | null,
  idOriginResource: string,
  percentage: string,
  active: boolean,
}

export type TransactionalInvestmentProfileCheckpointMant = CustomerTransactionalInvestmentProfileCheckpointMant;
export type InvestmentQuestionnaire = CustomerInvestmentQuestionnaire;
export type Questionnaire = CustomerQuestionnaire;
export type OrgignResourceCheckpoint = CustomerOrgignResourceCheckpoint;

