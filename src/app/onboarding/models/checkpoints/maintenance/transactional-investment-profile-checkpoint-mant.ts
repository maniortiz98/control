
export interface TransactionalInvestmentProfileCheckpointMant {
  customerType:            string;
  customerSubtype:         string;
  investmentProfile:       string;
  // investmentQuestionnaire: InvestmentQuestionnaire;
  questionnaire:           Questionnaire[];
  originResource:          OrgignResourceCheckpoint[];
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

export interface InvestmentQuestionnaire {
  dateOfBirth:        string;
  maritalStatus:      string;
  profession:         string;
  companyName:        string;
  position:           string;
  telephoneCompany:   string;
  companyWebsite:     string;
  question:           Questionnaire[];
  educationLevel:     string;
  occupation:         string;
  numberOfDependents: number;
  lineOfBusiness:     string;
  workDataId:         number;
}


export interface Questionnaire {
  idQuestion: string;
  idAnswer:   string;
}

export interface OrgignResourceCheckpoint{
  idOrigin: number | null,
  idOriginResource: string,
  percentage: string,
  active: boolean,
}
