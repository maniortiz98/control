interface LowRisk {
  id: number | null;
  companyName: string | null;
  jobTitle: string | null;
  timeWorking: string | null;
}

interface MediumRisk {
  id: number | null;
  initialInvestmentInActinver: string | null;
  relationship: string | null;
  justificationInitialInvestment: boolean | null;
}

interface HighRisk {
  id: number | null;
  productsOffered: string | null;
  inventory: boolean | null;
}

export interface InterviewData {
  id: number | null;
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
  homeVisit: boolean | null;
  reason: string | null;
  locality: string | null;
  addressType: string | null;
  matchingAddress: boolean | null;
  observationsHomeVisit: string | null;
  customerKnowledge: string | null;
  time: string | null;
  clientNumber: number | null;
  clientInvestmentAmount: string | null;
  initialInvestment: string | null;
  country: string | null;
  moreInformationClient: string | null;
  isPFWithBusinessActivity: boolean | null;
  lowRisk: LowRisk | null;
  mediumRisk: MediumRisk | null;
  highRisk: HighRisk | null;
}

export interface InterviewDataId {
  id: number;
  LowRisk: {
    id: number;
  }
  MediumRisk: {
    id: number;
  }
  HighRisk: {
    id: number;
  }
}