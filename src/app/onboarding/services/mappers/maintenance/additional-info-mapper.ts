import { convertDate, convertDateBack, convertDateToStr } from "../../../../shared/utils/datetime";
import { AdditionalInfoData, AdditionalInfoPageData } from "../../../models/additional-info";
import { AdditionalInfoCheckpoint, W8DateList } from '../../../models/checkpoints/maintenance/additional-info-checkpoint';

export function additionalInfoSectionToCheckpoint(request: AdditionalInfoPageData): AdditionalInfoCheckpoint{
  return {
    addressKey:         request.data.addressKey,
    sendingDocuments:   request.data.sendDocuments,
    exemptIsr:          request.data.isrExempt,
    expirationDate:     request.data.expirationDate,
    w8Format:           request.data.w8benForm,
    w8DateList:         request.table.map(i => ({
      id: i.id,
      initDate: i.startDateW8,
      endDate:  i.endDateW8,
      active: i.active
    })),
    locations:          request.data.locations,
    typeMarketToInvest: {
      exchangeOperations:               request.data.currencyOperations,
      thirdPartyInvestmentSocieties:    request.data.thirdPartyCompanies,
      investmentSocietiesOwn:           request.data.ownCompanies,
      domesticForeignShares:            request.data.sicShares,
      derivativesAndStructuredProducts: request.data.derivativeInstruments,
      fixedIncomeSecurities:            request.data.debtInstruments,
      savingsPlansWithTaxIncentives:    request.data.savingsPlans,
    }
  }
}

export function additionalInfoCheckpointToSection(data: AdditionalInfoCheckpoint): AdditionalInfoPageData{
  return {
   data: {
    tempId:                  crypto.randomUUID(),
    addressKey:              data.addressKey,
    sendDocuments:           data.sendingDocuments,
    isrExempt:               data.exemptIsr,
    expirationDate:          data.expirationDate,
    startDate:               '',
    endDate:                 '',
    w8benForm:               data.w8Format,
    locations:               data.locations,
		currencyOperations:      data.typeMarketToInvest.exchangeOperations,
    thirdPartyCompanies:     data.typeMarketToInvest.thirdPartyInvestmentSocieties,
    ownCompanies:            data.typeMarketToInvest.investmentSocietiesOwn,
    sicShares:               data.typeMarketToInvest.domesticForeignShares,
    derivativeInstruments:   data.typeMarketToInvest.derivativesAndStructuredProducts,
    debtInstruments:         data.typeMarketToInvest.fixedIncomeSecurities,
    savingsPlans:            data.typeMarketToInvest.savingsPlansWithTaxIncentives,
   },
   table: data.w8DateList.map(i => ({
    id: i.id,
    tempId:  crypto.randomUUID(),
    startDateW8: i.initDate,
    endDateW8: i.endDate,
    active: i.active
   }))
  }
}
