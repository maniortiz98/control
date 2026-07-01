import { FormGroup } from "@angular/forms";
import { TransactionalInvestmentProfileCheckpointMant } from "../../../models/checkpoints/maintenance/transactional-investment-profile-checkpoint-mant";

import { Ranges } from "../../../models/origin-resource";
import { InvestmentProfileData } from "../../../models/transactional-investment-profile-section";
import { HolderOption } from "../transactional-investment-mapper";

export function transactionalInvestmentSectionToCheckpointMant(
  transactionalForm: Record<string, any>,
  profileRating: any,
  selectedResources: Array<any>,
  investmentProfile: FormGroup,
  salesPracticeIdQuiz: string,
  maintenanceQuizForm: FormGroup,
  fullData: InvestmentProfileData | null,
  titulares: HolderOption[],
  personType?: string,

): TransactionalInvestmentProfileCheckpointMant {
  const rating = profileRating();
  let invpro = '1'; //TODO no admite null

  if (rating === null || rating === undefined || rating === '') {
    console.log('El valor está vacío, null o undefined');
  } else {
    console.log('Valor válido:', rating);
    invpro = rating;
  }

  let quest = Object.entries(transactionalForm)
  .filter(([key]) => /^\d+$/.test(key))
  .filter(([key]) => key !== "13032")
  .map(([key, value]) => ({
    idQuestion: key,
    idAnswer: value != null ? value.toString() : ''
  }))
  .filter(q => q.idAnswer !== '' || q.idQuestion === '8');


  const transactionalLimit =
  Object.entries(transactionalForm)
    .find(([key]) => key === "transactionalLimit")?.[1];


  quest.push({
    idQuestion: '21',
    idAnswer: transactionalLimit !== ""
      ? transactionalLimit?.toString() ?? null : null
  });


  return {
    // transactionalLimitId: Object.entries(transactionalForm).find(([key, _]) => key === "transactionalLimit")?.[1].toString() ?? '',
    practicaVentaId: fullData?.practicaVentaId ?? null,
    customerType: investmentProfile.value.service,
    customerSubtype: investmentProfile.value.subtype,
    investmentProfile: invpro,
    manageInvestmentsVia: Object.entries(transactionalForm).find(([key, _]) => key === "13032")?.[1].toString() ?? '', //1
    // investmentQuestionnaire: {
    //   dateOfBirth: '',
    //   maritalStatus: '',
    //   profession: '',
    //   companyName: '',
    //   position: '',
    //   telephoneCompany: '',
    //   companyWebsite: '',
    //   educationLevel: '',
    //   occupation: '',
    //   numberOfDependents: 0,
    //   lineOfBusiness: '',
    //   workDataId: 1,
    //   question: [],
    // },
    questionnaire: quest,
    originResource: selectedResources.map(sr => ({
      active: sr.active ?? true,
      idOriginResource: sr.type ?? '',
      percentage: sr.percentage !== null ? Number(sr.percentage).toString() : '',
      idOrigin: typeof sr.id === 'string' ? null :  Number(sr.id),
    })) ?? [],
    salesPracticeRate: profileRating()?.toString() || '',
    salesPracticePersonType: personType as string,
    salesPracticeIdQuiz: salesPracticeIdQuiz,

    sofclient: maintenanceQuizForm.value.sClient,
    marcoGeneral: maintenanceQuizForm.value.mga,
    globalFront: maintenanceQuizForm.value.globalFront,
    clientInst: maintenanceQuizForm.value.instClient,
    clientInstPub: maintenanceQuizForm.value.instClientPub,
    //TODO falta el notApply
    titularName: titulares.filter(t => t.value === maintenanceQuizForm.value.titular)[0]?.text ?? null,
    adendum: maintenanceQuizForm.value.adendum,
    cobroAsset: maintenanceQuizForm.value.awm,
    clientInstNot: maintenanceQuizForm.value.noInstClient,
    clientFidu: maintenanceQuizForm.value.instClientFid,
  }


}


export function getAnswer(id: string): string | number {
  const isPureNumber = /^[1-9]\d*$|^0$/.test(id);
  return isPureNumber ? Number(id) : id;
}


export function checkpointMantToTransactionaInvestmentProfileSection(request: TransactionalInvestmentProfileCheckpointMant, ranges: Ranges[]): InvestmentProfileData {

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
    maintenanceQuiz: {
      sClient: request.sofclient,
      adendum: request.adendum,
      mga: request.marcoGeneral,
      awm: request.cobroAsset,
      globalFront: request.globalFront,
      titular: request.titularName,
      notApply: false, //TODO falta este campo
      instClient: request.clientInst,
      noInstClient: request.clientInstNot,
      instClientPub: request.clientInstPub,
      instClientFid: request.clientFidu,
    },
    transactionalProfile: transactionalProfile,
    transactionalResources: (request?.originResource ?? []).map(or => ({
      type: or.idOriginResource,
      percentage: or.percentage !== null ? Number(or.percentage).toString() : '',
      active: or.active,
      text: ranges.find(r => r.rangeId == or.idOriginResource)?.description ?? '',
      id: or.idOrigin ?? null,
    })),
    investmentQuizId: 0,
    profileRating: request.investmentProfile,
    investmentQuizCompleted: request.investmentProfile ? true : false,
    onWorkFlow: false,
    practicaVentaId: request.practicaVentaId,
  }
}
