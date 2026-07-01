import { convertDate } from "../../../../shared/utils/datetime";
import { CreditData, CreditDataM } from "../../../models/checkpoints/response/maintenance/credit-data";

/**
 * Mapper when PERSONA FÍSICA
 */

export function transformCreditDataForService(input: any) {
  const g = input?.generalData ?? {};
  const e = input?.employmentData ?? {};

  const generalData = {
    economicActivity: g.economicActivity?.toString() ?? null,
    economicSector: g.economicSector,
    accountType: g.accountType,
    yearsOfOperation: Number(g.yearsOfOperation),
    riskGroup: g.riskGroup,
    numberOfEconomicDependents: Number(g.numberOfEconomicDependents),
  };

  const employmentData = {
    hiringDate: convertDate(e.hiringDate),
    salaried: typeof e.salaried === 'boolean' ? e.salaried : null,
    salary: Number(e.salary),
    paymentPeriod: e.paymentPeriod,
    paymentCurrencyType: e.paymentCurrencyType,
    employeeNumber: (e.employeeNumber ?? '').trim(),
    socialSecurityNumber: (e.socialSecurityNumber ?? '').trim(),
  };

  return {
    generalData,
    employmentData,
  };
}

/**
 * Mapper when PERSONA MORAL
 */
export function creditDataMapToServicePM(form: any, table: any): any {
  return {
    generalData: {
      economicActivity: form.economicActivity,
      economicSector: form.prospectSector,
      accountType: form.accountType,
      yearsOfOperation: form.operationYears,
      riskGroup: form.riskGroup,
      numberOfEconomicDependents: form.dependents,
    },
    employmentData: table.map((item: any) => {
      return {
        currentPosition: item.currentPosition,
        firstName: item.firstName,
        firstSurname: item.firstSurname,
        industryYears: item.industryYears,
        middleName: item.middleName,
        nationality: item.nationality,
        positionYears: item.positionYears,
        secondSurname: item.secondSurname,
      };
    }),
  };
}

export function transformCheckpointToCreditData(input: CreditDataM): CreditData {
  return {
  generalData: {
    economicActivity: input.generalData?.economicActivity,
    economicSector: input.generalData?.economicSector,
    accountType: input.generalData?.accountType,
    yearsOfOperation: input.generalData?.yearsOfOperation,
    riskGroup: input.generalData?.riskGroup,
    numberOfEconomicDependents: input.generalData?.numberOfEconomicDependents
  },
  employmentData: {
    hiringDate: input.employmentData?.hiringDate,
    salaried: input.employmentData?.salaried,
    salary: input.employmentData?.salary,
    paymentPeriod: input.employmentData?.paymentPeriod,
    paymentCurrencyType: input.employmentData?.paymentCurrencyType,
    employeeNumber: input.employmentData?.employeeNumber,
    socialSecurityNumber: input.employmentData?.socialSecurityNumber
  }
}
}