export interface PersonalInterviewData {
  id?: number;
  date: string;
  interviewee: string;
  opening: string;
  interviewLocation: string;
  otherLocation: string;
  question1: boolean;
  question2: boolean;
  atypicalSituation: string;
  question3: boolean;
  atypicalSituationOther: String;
  residence: string;
  geographicalArea: string;
  matchingAddress: boolean;
  homeVisit: boolean;
  reason: string;
  locality: string;
  addressType: number;
  observationsHomeVisit: string;
  customerKnowledge: string;
  time: string;
  clientNumber: number;
  clientInvestmentAmount: string;
  initialInvestment: string;
  country: string;
  moreInformationClient: string;
  isPFWithBusinessActivity: boolean;
  lowRisk: {
    companyName: string;
    jobTitle: string;
    timeWorking: string;
  };
  mediumRisk: {
    initialInvestmentInActinver: string;
    relationship: string;
    justificationInitialInvestment: boolean;
  };
  highRisk: {
    productsOffered: string;
    inventory: boolean;
  };
}
