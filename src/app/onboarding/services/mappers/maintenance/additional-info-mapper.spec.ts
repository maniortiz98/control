import {
  additionalInfoCheckpointToSection,
  additionalInfoSectionToCheckpoint,
} from './additional-info-mapper';
import { AdditionalInfoPageData } from '../../../models/additional-info';
import { AdditionalInfoCheckpoint } from '../../../models/checkpoints/maintenance/additional-info-checkpoint';

describe('additional-info-mapper', () => {
  describe('additionalInfoSectionToCheckpoint', () => {
    it('debe mapear correctamente la seccion a checkpoint', () => {
      const request: AdditionalInfoPageData = {
        data: {
          tempId: 'temp-data',
          addressKey: '1',
          sendDocuments: '2',
          isrExempt: true,
          expirationDate: '2030-12-31',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          w8benForm: true,
          locations: 'MX',
          currencyOperations: true,
          thirdPartyCompanies: false,
          ownCompanies: true,
          sicShares: false,
          derivativeInstruments: true,
          debtInstruments: false,
          savingsPlans: true,
        },
        table: [
          {
            tempId: 'temp-row-1',
            id: 10,
            startDateW8: '2024-01-01',
            endDateW8: '2024-12-31',
            active: true,
          },
          {
            tempId: 'temp-row-2',
            id: 20,
            startDateW8: '2025-01-01',
            endDateW8: '2025-12-31',
            active: false,
          },
        ],
      };

      const result = additionalInfoSectionToCheckpoint(request);

      expect(result).toEqual({
        addressKey: '1',
        sendingDocuments: '2',
        exemptIsr: true,
        expirationDate: '2030-12-31',
        w8Format: true,
        w8DateList: [
          {
            id: 10,
            initDate: '2024-01-01',
            endDate: '2024-12-31',
            active: true,
          },
          {
            id: 20,
            initDate: '2025-01-01',
            endDate: '2025-12-31',
            active: false,
          },
        ],
        locations: 'MX',
        typeMarketToInvest: {
          exchangeOperations: true,
          thirdPartyInvestmentSocieties: false,
          investmentSocietiesOwn: true,
          domesticForeignShares: false,
          derivativesAndStructuredProducts: true,
          fixedIncomeSecurities: false,
          savingsPlansWithTaxIncentives: true,
        },
      });
    });

    it('debe mapear listas W8 vacias sin alterar el resto de campos', () => {
      const request: AdditionalInfoPageData = {
        data: {
          addressKey: '4',
          sendDocuments: '1',
          isrExempt: false,
          expirationDate: '',
          startDate: '',
          endDate: '',
          w8benForm: false,
          locations: 'US',
          currencyOperations: false,
          thirdPartyCompanies: false,
          ownCompanies: false,
          sicShares: false,
          derivativeInstruments: false,
          debtInstruments: false,
          savingsPlans: false,
        },
        table: [],
      };

      const result = additionalInfoSectionToCheckpoint(request);

      expect(result.w8DateList).toEqual([]);
      expect(result.typeMarketToInvest).toEqual({
        exchangeOperations: false,
        thirdPartyInvestmentSocieties: false,
        investmentSocietiesOwn: false,
        domesticForeignShares: false,
        derivativesAndStructuredProducts: false,
        fixedIncomeSecurities: false,
        savingsPlansWithTaxIncentives: false,
      });
    });
  });

  describe('additionalInfoCheckpointToSection', () => {
    it('debe mapear correctamente el checkpoint a seccion y generar tempIds', () => {
      const checkpoint: AdditionalInfoCheckpoint = {
        addressKey: '2',
        sendingDocuments: '3',
        exemptIsr: true,
        expirationDate: '2031-01-01',
        w8Format: false,
        w8DateList: [
          {
            id: 99,
            initDate: '2026-01-01',
            endDate: '2026-12-31',
            active: true,
          },
        ],
        locations: 'OTRO',
        typeMarketToInvest: {
          exchangeOperations: true,
          thirdPartyInvestmentSocieties: true,
          investmentSocietiesOwn: false,
          domesticForeignShares: true,
          derivativesAndStructuredProducts: false,
          fixedIncomeSecurities: true,
          savingsPlansWithTaxIncentives: false,
        },
      };

      const uuidSpy = spyOn(crypto, 'randomUUID').and.returnValues(
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222'
      );

      const result = additionalInfoCheckpointToSection(checkpoint);

      expect(uuidSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        data: {
          tempId: '11111111-1111-4111-8111-111111111111',
          addressKey: '2',
          sendDocuments: '3',
          isrExempt: true,
          expirationDate: '2031-01-01',
          startDate: '',
          endDate: '',
          w8benForm: false,
          locations: 'OTRO',
          currencyOperations: true,
          thirdPartyCompanies: true,
          ownCompanies: false,
          sicShares: true,
          derivativeInstruments: false,
          debtInstruments: true,
          savingsPlans: false,
        },
        table: [
          {
            id: 99,
            tempId: '22222222-2222-4222-8222-222222222222',
            startDateW8: '2026-01-01',
            endDateW8: '2026-12-31',
            active: true,
          },
        ],
      });
    });

    it('debe soportar checkpoint sin fechas W8', () => {
      const checkpoint: AdditionalInfoCheckpoint = {
        addressKey: '5',
        sendingDocuments: '4',
        exemptIsr: false,
        expirationDate: '',
        w8Format: true,
        w8DateList: [],
        locations: 'MX',
        typeMarketToInvest: {
          exchangeOperations: false,
          thirdPartyInvestmentSocieties: false,
          investmentSocietiesOwn: true,
          domesticForeignShares: false,
          derivativesAndStructuredProducts: true,
          fixedIncomeSecurities: false,
          savingsPlansWithTaxIncentives: true,
        },
      };

      spyOn(crypto, 'randomUUID').and.returnValue('33333333-3333-4333-8333-333333333333');

      const result = additionalInfoCheckpointToSection(checkpoint);

      expect(result.data.tempId).toBe('33333333-3333-4333-8333-333333333333');
      expect(result.table).toEqual([]);
      expect(result.data.ownCompanies).toBeTrue();
      expect(result.data.derivativeInstruments).toBeTrue();
      expect(result.data.savingsPlans).toBeTrue();
    });
  });
});
