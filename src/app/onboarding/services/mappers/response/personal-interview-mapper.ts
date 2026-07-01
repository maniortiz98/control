import { PersonalInterviewData } from "../../../models/checkpoints/personal-interview";
import { PersonalInterviewRes } from "../../../models/checkpoints/response/personal-interview";

export function mapResToPersonalInterview(
  input: PersonalInterviewRes
): PersonalInterviewData {
  return {
    date: input.date ?? '',
    interviewee: input.interviewee ?? '',
    opening: input.opening ?? '',
    interviewLocation: input.interviewLocation ?? '',
    otherLocation: input.otherLocation ?? '',
    question1: input.question1 ?? false,
    question2: input.question2 ?? false,
    atypicalSituation: input.atypicalSituation ?? '',
    question3: input.question3 ?? false,
    atypicalSituationOther: input.atypicalSituationOther ?? '',
    residence: input.residence ?? '',
    geographicalArea: input.geographicalArea ?? '',
    homeVisit: input.homeVisit ?? false,
    reason: input.reason ?? '',
    locality: input.locality ?? '',
    addressType: Number(input.addressType) ?? 0,
    matchingAddress: input.matchingAddress ?? false,
    observationsHomeVisit: input.observationsHomeVisit ?? '',
    customerKnowledge: input.customerKnowledge ?? '',
    time: input.time ?? '',
    clientNumber: Number(input.clientNumber) ?? 0,
    clientInvestmentAmount: input.clientInvestmentAmount ?? '',
    initialInvestment: input.initialInvestment ?? '',
    country: input.country ?? '',
    moreInformationClient: input.moreInformationClient ?? '',
    isPFWithBusinessActivity: input.isPFWithBusinessActivity ?? false,
    lowRisk: {
      companyName: input.lowRisk?.companyName ?? '',
      jobTitle: input.lowRisk?.jobTitle ?? '',
      timeWorking: input.lowRisk?.timeWorking ?? '',
    },
    mediumRisk: {
      initialInvestmentInActinver:
        input.mediumRisk?.initialInvestmentInActinver ?? '',
      relationship:
        input.mediumRisk?.relationship?.toString?.() ?? '',
      justificationInitialInvestment:
        input.mediumRisk?.justificationInitialInvestment ?? false,
    },
    highRisk: {
      productsOffered: input.highRisk?.productsOffered ?? '',
      inventory: input.highRisk?.inventory ?? false,
    },
  };
}