import { FormGroup } from "@angular/forms";
import { TransactionalInvestmentProfileCheckpoint } from "../../models/checkpoints/transactional-investment-profile-checkpoint";
import { Data } from "../../models/checkpoints/initial-data-checkpoint";
import { CotitularInfo } from "../../models/cotitular";
import { InvestmentProfileData } from "../../models/transactional-investment-profile-section";
import { TransactionalResource } from "../../models/general-info-pm";
import { Ranges } from "../../models/origin-resource";

export function transactionalInvestmentSectionToCheckpoint(
  transactionalForm: Record<string, any>,
  profileRating: any,
  selectedResources: Array<TransactionalResource>,
  investmentProfile: FormGroup,
  salesPracticeIdQuiz: string,
  personType?: string,
  maintenanceQuizForm?: Record<string, any>,
  ): TransactionalInvestmentProfileCheckpoint {
  let quest = Object.entries(transactionalForm)
  .filter(([key]) => key !== '13032' && key !== 'transactionalLimit')
  .map(([key, value]) => ({
    idQuestion: key,
    idAnswer: value != null ? value.toString() : ''
  }))
  .filter(q => q.idAnswer !== null && q.idAnswer !== undefined)

  const transactionalLimit =
  Object.entries(transactionalForm)
    .find(([key]) => key === "transactionalLimit")?.[1];


  quest.push({
    idQuestion: '21',
    idAnswer: transactionalLimit !== ""
      ? transactionalLimit?.toString() ?? null : null
  });


  return {
    // transactionalLimitId:    Object.entries(transactionalForm).find(([key, _]) => key === "transactionalLimit")?.[1].toString() ?? '',
    customerType:            investmentProfile.value.service,
    customerSubtype:         investmentProfile.value.subtype,
    investmentProfile:       profileRating() ?? '0',
    manageInvestmentsVia:    Object.entries(transactionalForm).find(([key, _]) => key === "13032")?.[1].toString() ?? '', //1
    // investmentQuestionnaire: {
    //   dateOfBirth:        '01/01/2025',
    //   maritalStatus:      '',
    //   profession:         '',
    //   companyName:        '',
    //   position:           '',
    //   telephoneCompany:   '',
    //   companyWebsite:     '',
    //   educationLevel:     '',
    //   occupation:         '',
    //   numberOfDependents: 0,
    //   lineOfBusiness:     '',
    //   question: [
    //     {
    //       idQuestion: '1',
    //       idAnswer: '1'
    //     }
    //   ],
    // },
    questionnaire: quest,
    originResource: selectedResources
    .filter(sr => sr.active)
    .map(sr => ({
      idOriginResource: sr.type ?? '',
      percentage:       sr.percentage != null ? sr.percentage.toString() : '',
    })) ?? [],
    salesPracticeRate: profileRating()?.toString() || '',
    salesPracticePersonType: personType as string,
    salesPracticeIdQuiz: salesPracticeIdQuiz,
    // maintenanceQuiz: maintenanceQuizForm || null,
  }
}

export function checkpointToTransactionalInvestmentSection(request: TransactionalInvestmentProfileCheckpoint, ranges: Ranges[]): InvestmentProfileData{

  console.log({request})
    const entry21 = (request?.questionnaire ?? []).find(q => String(q.idQuestion) === "21");
    console.log({entry21})
    const transactionalLimitFromQ21 = entry21
    ? getAnswer(entry21.idAnswer)
    : undefined;

    console.log({transactionalLimitFromQ21})
    let transactionalProfile = {
      ...Object.fromEntries(
        (request?.questionnaire ?? []).map((q: any) => ([
          Number(q.idQuestion),
          getAnswer(q.idAnswer),
        ]))
      ),
      13032: request.manageInvestmentsVia,
      transactionalLimit: transactionalLimitFromQ21
    };

    return {
      investmentProfile: {
        service: request.customerType,
        subtype: request.customerSubtype,
      },
      investmentProfileQuiz: Object.entries(request?.questionnaire ?? []).filter(([key, _]) => key != "13032")
        .map(([key, value]) => ({
          idQuestion: key,
          idAnswer: value.toString()
        })),
      maintenanceQuiz: null,
      transactionalProfile: transactionalProfile,
      transactionalResources: (request?.originResource ?? []).map(or => ({
        type: or.idOriginResource,
        percentage: or.percentage !== null ? Number(or.percentage).toString() : '',
        active: true,
        text: ranges.find(r => r.rangeId == or.idOriginResource)?.description ?? '',
        id: crypto.randomUUID(),
      })),
      investmentQuizId: 0,
      profileRating: request.investmentProfile,
      investmentQuizCompleted: request.investmentProfile ? true : false,
      onWorkFlow: false,
    }
}

export function getAnswer(id: string): string | number {
  const isPureNumber = /^[1-9]\d*$|^0$/.test(id);
  return isPureNumber ? Number(id) : id;
}


export function getHolderOption(data:Data): HolderOption {
  return {
    text: `${data.firstName} ${data.middleName} ${data.firstLastName} ${data.secondLastName}`,
    value: data.id,
  }
}

export function getCoHoldersOptions(coHolders: CotitularInfo[]): HolderOption[] {
  if(!coHolders || coHolders.length < 1) return [];

  return coHolders.map((coHolder:CotitularInfo) => {
    return {
      text:  `${coHolder.dataSection?.firstName} ${coHolder.dataSection?.middleName} ${coHolder.dataSection?.firstLastName} ${coHolder.dataSection?.secondLastName}`,
      value: coHolder.cotitularNumber
    }
  });
}

export type HolderOption = {
  text: string,
  value: number | undefined,
}
