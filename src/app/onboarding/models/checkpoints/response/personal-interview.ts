export interface PersonalInterviewRes {
  date: string | null;
  interviewee: string | null;
  opening: string | null;
  interviewLocation: string | null;
  otherLocation: string | null;
  question1: boolean | null;
  question2: boolean | null;
  atypicalSituation: string | null;
  question3: boolean | null;
  atypicalSituationOther: string | null;
  residence: string | null;
  geographicalArea: string | null;
  matchingAddress: boolean | null;
  homeVisit: boolean | null;
  reason: string | null;
  locality: string | null;
  addressType: number | null;
  observationsHomeVisit: string | null;
  customerKnowledge: string | null;
  time: string | null;
  clientNumber: number | null;
  clientInvestmentAmount: string | null;
  initialInvestment: string | null;
  country: string | null;
  moreInformationClient: string | null;
  isPFWithBusinessActivity: boolean | null;
  lowRisk: {
    companyName: string | null;
    jobTitle: string | null;
    timeWorking: string | null;
  };
  mediumRisk: {
    initialInvestmentInActinver: string | null;
    relationship: number | null;
    justificationInitialInvestment: boolean | null;
  };
  highRisk: {
    productsOffered: string | null;
    inventory: boolean | null;
  };
}
