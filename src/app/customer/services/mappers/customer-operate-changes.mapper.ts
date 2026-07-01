import { CustomerOperateChangesCheckpoint } from '../../models/checkpoints/customer-operate-changes-checkpoint';
import {  CustomerOperateChangesSection } from '../../models/customer-operate-changes';

export function operateChangeSectionToCheckpoint(data: CustomerOperateChangesSection): CustomerOperateChangesCheckpoint {
  return {
      fxOperationReasons: {
        fxMetalsInvestments: data.metalChangeInversion ?? false,
        curreencyTrading: data.currencySellAndBuy ?? false,
        importExport: {
          isImportExport: data.importAndExport,
          countryOrigin: data.countrySender,
          countryDestination: data.countryReciber
        },
        personalFundsReceipt: {
          isPersonalFundsReceipt: data.resourceReception,
          originCountry: data.resourceCountrySender,
        }
      },
      fxOperationsDetails: {
        transactionType: {
          cash: {
            isChash: data.cash,
            mounthlyCashTransactions: Number(data.cashOperationNumber),
            mounthlyCashAmount:  Number(data.cashOperationAmount)
          },
          transfer: {
            isTransfer: data.transfer,
            mounthlyTransferTransactions:  Number(data.transferOperationNumber),
            mounthlyTransferAmount:  Number(data.transferOperationAmount)
          },
          document: {
            isDocument: data.document,
            mounthlyDocumentTransactions:  Number(data.documentOperationNumber),
            mounthlyDocumentAmount:  Number(data.documentOperationAmount)
          },
          travelerCheck: {
            isTravelerCheck: data.travelerCheck,
            mounthlyTravelerCheckTransactions:  Number(data.travelerCheckOperationNumber),
            mounthlyTravelerCheckAmount:  Number(data.travelerCheckOperationAmount)
          }
        },
        coinMetalType: {
          gold: {
            isGold: data.gold,
            mounthlyGoldTransactions:  Number(data.goldOperationNumber),
            mounthlyGoldAmount:  Number(data.goldOperationAmount)
          },
          silver: {
            isSilver: data.silver,
            mounthlySilverTransactions:  Number(data.silverOperationNumber),
            mounthlySilverAmount:  Number(data.silverOperationAmount)
          },
          other: {
            isOther: data.other,
            otherMetalType: data.otherType,
            mounthlyOtherTransactions:  Number(data.otherOperationNumber),
            mounthlyOtherAmount:  Number(data.otherOperationAmount)
          }
        }
      }
    }
}



export function checkpointToOperateChangeSection(data: CustomerOperateChangesCheckpoint): CustomerOperateChangesSection | null{
  console.log('Consultando opera cambios')
  console.log({data})
  if(!data || !data.fxOperationReasons ){
    return null;
  }
  return {
    fxOperationReasonsId: null,
    fxOperationsDetailsId: null,
    metalChangeInversion: data.fxOperationReasons.fxMetalsInvestments,
    currencySellAndBuy: data.fxOperationReasons.curreencyTrading,

    importAndExport: data.fxOperationReasons.importExport.isImportExport,
    countrySender: data.fxOperationReasons.importExport.countryOrigin,
    countryReciber: data.fxOperationReasons.importExport.countryDestination,

    resourceReception: data.fxOperationReasons.personalFundsReceipt.isPersonalFundsReceipt,
    resourceCountrySender: data.fxOperationReasons.personalFundsReceipt.originCountry,
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

    cash: data.fxOperationsDetails.transactionType.cash.isChash,
    cashOperationNumber: data.fxOperationsDetails.transactionType.cash.mounthlyCashTransactions?.toString() ?? '',
    cashOperationAmount: data.fxOperationsDetails.transactionType.cash.mounthlyCashAmount?.toString() ?? '',

    transfer: data.fxOperationsDetails.transactionType.transfer.isTransfer,
    transferOperationNumber: data.fxOperationsDetails.transactionType.transfer.mounthlyTransferTransactions?.toString() ?? '',
    transferOperationAmount: data.fxOperationsDetails.transactionType.transfer.mounthlyTransferAmount?.toString() ?? '',

    document: data.fxOperationsDetails.transactionType.document.isDocument,
    documentOperationNumber: data.fxOperationsDetails.transactionType.document.mounthlyDocumentTransactions?.toString() ?? '',
    documentOperationAmount: data.fxOperationsDetails.transactionType.document.mounthlyDocumentAmount?.toString() ?? '',

    travelerCheck: data.fxOperationsDetails.transactionType.travelerCheck.isTravelerCheck,
    travelerCheckOperationNumber: data.fxOperationsDetails.transactionType.travelerCheck.mounthlyTravelerCheckTransactions?.toString() ?? '',
    travelerCheckOperationAmount: data.fxOperationsDetails.transactionType.travelerCheck.mounthlyTravelerCheckAmount?.toString() ?? '',

    gold: data.fxOperationsDetails.coinMetalType.gold.isGold,
    goldOperationNumber: data.fxOperationsDetails.coinMetalType.gold.mounthlyGoldTransactions?.toString() ?? '',
    goldOperationAmount: data.fxOperationsDetails.coinMetalType.gold.mounthlyGoldAmount?.toString() ?? '',

    silver: data.fxOperationsDetails.coinMetalType.silver.isSilver,
    silverOperationNumber: data.fxOperationsDetails.coinMetalType.silver.mounthlySilverTransactions?.toString() ?? '',
    silverOperationAmount: data.fxOperationsDetails.coinMetalType.silver.mounthlySilverAmount?.toString() ?? '',

    other: data.fxOperationsDetails.coinMetalType.other.isOther,
    otherType: data.fxOperationsDetails.coinMetalType.other.otherMetalType,
    otherOperationNumber: data.fxOperationsDetails.coinMetalType.other.mounthlyOtherTransactions?.toString() ?? '',
    otherOperationAmount: data.fxOperationsDetails.coinMetalType.other.mounthlyOtherAmount?.toString() ?? ''

  };
}


