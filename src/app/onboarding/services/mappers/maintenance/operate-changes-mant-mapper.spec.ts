import {
  checkpointToOperateChangeSectionMant,
  operateChangeSectionToCheckpointMant,
} from './operate-changes-mant-mapper';
import { OperateChangesSection } from '../../../models/operate-changes';
import { OperateChangesCheckpointMant } from '../../../models/checkpoints/maintenance/operate-changes-mant-checkpoint';

describe('operate-changes-mant-mapper', () => {
  describe('operateChangeSectionToCheckpointMant', () => {
    it('debe mapear correctamente la seccion al checkpoint y convertir strings numericos a number', () => {
      const section: OperateChangesSection = {
        fxOperationReasonsId: 11,
        fxOperationsDetailsId: 22,
        metalChangeInversion: true,
        currencySellAndBuy: false,
        importAndExport: true,
        countrySender: 'MX',
        countryReciber: 'US',
        resourceReception: true,
        resourceCountrySender: 'CA',
        resourceCounteyReciber: 'MX',
        liquidationSupplier: false,
        liquidationSupplierCountryDestiny: 'US',
        donation: true,
        donationCountrySender: 'AR',
        donationCountryReciber: 'CL',
        inversion: true,
        inversionCountrySender: 'ES',
        inversionCountryReciber: 'FR',
        liquidationOperation: false,
        liquidationOperationCountryReciber: 'DE',
        clientPayment: true,
        clientPaymentCountrySender: 'GB',
        cash: true,
        cashOperationNumber: '10',
        cashOperationAmount: '1000',
        transfer: true,
        transferOperationNumber: '20',
        transferOperationAmount: '2000',
        document: false,
        documentOperationNumber: '30',
        documentOperationAmount: '3000',
        travelerCheck: true,
        travelerCheckOperationNumber: '40',
        travelerCheckOperationAmount: '4000',
        gold: true,
        goldOperationNumber: '50',
        goldOperationAmount: '5000',
        silver: false,
        silverOperationNumber: '60',
        silverOperationAmount: '6000',
        other: true,
        otherType: 'PLATINO',
        otherOperationNumber: '70',
        otherOperationAmount: '7000',
      };

      const result = operateChangeSectionToCheckpointMant(section);

      expect(result).toEqual({
        fxOperationReasons: {
          id: 11,
          fxMetalsInvestments: true,
          curreencyTrading: false,
          importExport: {
            isImportExport: true,
            countryOrigin: 'MX',
            countryDestination: 'US',
          },
          personalFundsReceipt: {
            isPersonalFundsReceipt: true,
            originCountry: 'CA',
            countryDestination: 'MX',
          },
          settlementToSuppliersAbroad: {
            isSettlementToSuppliersAbroad: false,
            destinationCountry: 'US',
          },
          receiptOrSendingDonations: {
            isReceiptOrSendingDonations: true,
            originCountry: 'AR',
            countryDestination: 'CL',
          },
          forInvestment: {
            isForInvestment: true,
            originCountry: 'ES',
            countryDestination: 'FR',
          },
          settlementOfFinancialOperations: {
            isSettlementOfFinancialOperations: false,
            destinationCountry: 'DE',
          },
          clientPaymentReceipt: {
            isClientPaymentReceipt: true,
            provenanceCountry: 'GB',
          },
        },
        fxOperationsDetails: {
          id: 22,
          transactionType: {
            cash: {
              isChash: true,
              mounthlyCashTransactions: 10,
              mounthlyCashAmount: 1000,
            },
            transfer: {
              isTransfer: true,
              mounthlyTransferTransactions: 20,
              mounthlyTransferAmount: 2000,
            },
            document: {
              isDocument: false,
              mounthlyDocumentTransactions: 30,
              mounthlyDocumentAmount: 3000,
            },
            travelerCheck: {
              isTravelerCheck: true,
              mounthlyTravelerCheckTransactions: 40,
              mounthlyTravelerCheckAmount: 4000,
            },
          },
          coinMetalType: {
            gold: {
              isGold: true,
              mounthlyGoldTransactions: 50,
              mounthlyGoldAmount: 5000,
            },
            silver: {
              isSilver: false,
              mounthlySilverTransactions: 60,
              mounthlySilverAmount: 6000,
            },
            other: {
              isOther: true,
              otherMetalType: 'PLATINO',
              mounthlyOtherTransactions: 70,
              mounthlyOtherAmount: 7000,
            },
          },
        },
      });
    });

    it('debe usar 0 como default para ids nulos', () => {
      const result = operateChangeSectionToCheckpointMant({
        fxOperationReasonsId: null,
        fxOperationsDetailsId: null,
        metalChangeInversion: false,
        currencySellAndBuy: false,
        importAndExport: false,
        countrySender: '',
        countryReciber: '',
        resourceReception: false,
        resourceCountrySender: '',
        resourceCounteyReciber: '',
        liquidationSupplier: false,
        liquidationSupplierCountryDestiny: '',
        donation: false,
        donationCountrySender: '',
        donationCountryReciber: '',
        inversion: false,
        inversionCountrySender: '',
        inversionCountryReciber: '',
        liquidationOperation: false,
        liquidationOperationCountryReciber: '',
        clientPayment: false,
        clientPaymentCountrySender: '',
        cash: false,
        cashOperationNumber: '0',
        cashOperationAmount: '0',
        transfer: false,
        transferOperationNumber: '0',
        transferOperationAmount: '0',
        document: false,
        documentOperationNumber: '0',
        documentOperationAmount: '0',
        travelerCheck: false,
        travelerCheckOperationNumber: '0',
        travelerCheckOperationAmount: '0',
        gold: false,
        goldOperationNumber: '0',
        goldOperationAmount: '0',
        silver: false,
        silverOperationNumber: '0',
        silverOperationAmount: '0',
        other: false,
        otherType: '',
        otherOperationNumber: '0',
        otherOperationAmount: '0',
      });

      expect(result.fxOperationReasons.id).toBe(0);
      expect(result.fxOperationsDetails.id).toBe(0);
    });
  });

  describe('checkpointToOperateChangeSectionMant', () => {
    it('debe mapear correctamente el checkpoint a la seccion y convertir numbers a string', () => {
      const checkpoint: OperateChangesCheckpointMant = {
        fxOperationReasons: {
          id: 11,
          fxMetalsInvestments: true,
          curreencyTrading: true,
          importExport: {
            isImportExport: true,
            countryOrigin: 'MX',
            countryDestination: 'US',
          },
          personalFundsReceipt: {
            isPersonalFundsReceipt: false,
            originCountry: 'CA',
            countryDestination: 'MX',
          },
          settlementToSuppliersAbroad: {
            isSettlementToSuppliersAbroad: true,
            destinationCountry: 'AR',
          },
          receiptOrSendingDonations: {
            isReceiptOrSendingDonations: false,
            originCountry: 'CL',
            countryDestination: 'PE',
          },
          forInvestment: {
            isForInvestment: true,
            originCountry: 'ES',
            countryDestination: 'FR',
          },
          settlementOfFinancialOperations: {
            isSettlementOfFinancialOperations: true,
            destinationCountry: 'DE',
          },
          clientPaymentReceipt: {
            isClientPaymentReceipt: false,
            provenanceCountry: 'GB',
          },
        },
        fxOperationsDetails: {
          id: 22,
          transactionType: {
            cash: {
              isChash: true,
              mounthlyCashTransactions: 1,
              mounthlyCashAmount: 100,
            },
            transfer: {
              isTransfer: true,
              mounthlyTransferTransactions: 2,
              mounthlyTransferAmount: 200,
            },
            document: {
              isDocument: false,
              mounthlyDocumentTransactions: 3,
              mounthlyDocumentAmount: 300,
            },
            travelerCheck: {
              isTravelerCheck: true,
              mounthlyTravelerCheckTransactions: 4,
              mounthlyTravelerCheckAmount: 400,
            },
          },
          coinMetalType: {
            gold: {
              isGold: true,
              mounthlyGoldTransactions: 5,
              mounthlyGoldAmount: 500,
            },
            silver: {
              isSilver: false,
              mounthlySilverTransactions: 6,
              mounthlySilverAmount: 600,
            },
            other: {
              isOther: true,
              otherMetalType: 'PLATA',
              mounthlyOtherTransactions: 7,
              mounthlyOtherAmount: 700,
            },
          },
        },
      } as any;

      const result = checkpointToOperateChangeSectionMant(checkpoint);

      expect(result).toEqual({
        fxOperationReasonsId: 11,
        fxOperationsDetailsId: 22,
        metalChangeInversion: true,
        currencySellAndBuy: true,
        importAndExport: true,
        countrySender: 'MX',
        countryReciber: 'US',
        resourceReception: false,
        resourceCountrySender: 'CA',
        resourceCounteyReciber: 'MX',
        liquidationSupplier: true,
        liquidationSupplierCountryDestiny: 'AR',
        donation: false,
        donationCountrySender: 'CL',
        donationCountryReciber: 'PE',
        inversion: true,
        inversionCountrySender: 'ES',
        inversionCountryReciber: 'FR',
        liquidationOperation: true,
        liquidationOperationCountryReciber: 'DE',
        clientPayment: false,
        clientPaymentCountrySender: 'GB',
        cash: true,
        cashOperationNumber: '1',
        cashOperationAmount: '100',
        transfer: true,
        transferOperationNumber: '2',
        transferOperationAmount: '200',
        document: false,
        documentOperationNumber: '3',
        documentOperationAmount: '300',
        travelerCheck: true,
        travelerCheckOperationNumber: '4',
        travelerCheckOperationAmount: '400',
        gold: true,
        goldOperationNumber: '5',
        goldOperationAmount: '500',
        silver: false,
        silverOperationNumber: '6',
        silverOperationAmount: '600',
        other: true,
        otherType: 'PLATA',
        otherOperationNumber: '7',
        otherOperationAmount: '700',
      });
    });
  });
});
