import { OperateChangesCheckpoint } from '../../models/checkpoints/operate-changes-checkpoint';
import {  OperateChangesSection } from '../../models/operate-changes';

export function operateChangeSectionToCheckpoint(data: OperateChangesSection): OperateChangesCheckpoint {
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
            mounthlyCashTransactions: data.cashOperationNumber !== '' ? Number(data.cashOperationNumber) : null,
            mounthlyCashAmount: data.cashOperationAmount !== '' ? Number(data.cashOperationAmount) : null
          },
          transfer: {
            isTransfer: data.transfer,
            mounthlyTransferTransactions:  data.transferOperationNumber !== '' ? Number(data.transferOperationNumber) : null,
            mounthlyTransferAmount:  data.transferOperationAmount !== '' ? Number(data.transferOperationAmount) : null
          },
          document: {
            isDocument: data.document,
            mounthlyDocumentTransactions:  data.documentOperationNumber !== '' ? Number(data.documentOperationNumber) : null,
            mounthlyDocumentAmount:  data.documentOperationAmount !== '' ?  Number(data.documentOperationAmount) : null
          },
          travelerCheck: {
            isTravelerCheck: data.travelerCheck,
            mounthlyTravelerCheckTransactions: data.travelerCheckOperationNumber !== '' ? Number(data.travelerCheckOperationNumber) : null,
            mounthlyTravelerCheckAmount: data.travelerCheckOperationAmount !== '' ? Number(data.travelerCheckOperationAmount) : null
          }
        },
        coinMetalType: {
          gold: {
            isGold: data.gold,
            mounthlyGoldTransactions: data.goldOperationNumber !== '' ? Number(data.goldOperationNumber) : null,
            mounthlyGoldAmount:  data.goldOperationAmount !== '' ? Number(data.goldOperationAmount) : null
          },
          silver: {
            isSilver: data.silver,
            mounthlySilverTransactions: data.silverOperationNumber !== '' ?  Number(data.silverOperationNumber) : null,
            mounthlySilverAmount:  data.silverOperationAmount !== '' ? Number(data.silverOperationAmount) : null
          },
          other: {
            isOther: data.other,
            otherMetalType: data.otherType,
            mounthlyOtherTransactions: data.otherOperationNumber !== '' ? Number(data.otherOperationNumber) : null,
            mounthlyOtherAmount: data.otherOperationAmount !== '' ? Number(data.otherOperationAmount) : null
          }
        }
      }
    }
}



export function checkpointToOperateChangeSection(data: OperateChangesCheckpoint): OperateChangesSection | null{
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

    importAndExport: data.fxOperationReasons.importExport?.isImportExport,
    countrySender: data.fxOperationReasons.importExport?.countryOrigin,
    countryReciber: data.fxOperationReasons.importExport?.countryDestination,

    resourceReception: data.fxOperationReasons.personalFundsReceipt?.isPersonalFundsReceipt,
    resourceCountrySender: data.fxOperationReasons.personalFundsReceipt?.originCountry,
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

    cash: data.fxOperationsDetails?.transactionType?.cash?.isChash,
    cashOperationNumber: data.fxOperationsDetails?.transactionType?.cash?.mounthlyCashTransactions?.toString() ?? '',
    cashOperationAmount: data.fxOperationsDetails?.transactionType?.cash?.mounthlyCashAmount?.toString() ?? '',

    transfer: data.fxOperationsDetails?.transactionType?.transfer?.isTransfer,
    transferOperationNumber: data.fxOperationsDetails?.transactionType?.transfer?.mounthlyTransferTransactions?.toString() ?? '',
    transferOperationAmount: data.fxOperationsDetails?.transactionType?.transfer?.mounthlyTransferAmount?.toString() ?? '',

    document: data.fxOperationsDetails?.transactionType?.document?.isDocument,
    documentOperationNumber: data.fxOperationsDetails?.transactionType?.document?.mounthlyDocumentTransactions?.toString() ?? '',
    documentOperationAmount: data.fxOperationsDetails?.transactionType?.document?.mounthlyDocumentAmount?.toString() ?? '',

    travelerCheck: data.fxOperationsDetails?.transactionType?.travelerCheck?.isTravelerCheck,
    travelerCheckOperationNumber: data.fxOperationsDetails?.transactionType?.travelerCheck?.mounthlyTravelerCheckTransactions?.toString() ?? '',
    travelerCheckOperationAmount: data.fxOperationsDetails?.transactionType?.travelerCheck?.mounthlyTravelerCheckAmount?.toString() ?? '',

    gold: data.fxOperationsDetails?.coinMetalType?.gold?.isGold,
    goldOperationNumber: data.fxOperationsDetails?.coinMetalType?.gold?.mounthlyGoldTransactions?.toString() ?? '',
    goldOperationAmount: data.fxOperationsDetails?.coinMetalType?.gold?.mounthlyGoldAmount?.toString() ?? '',

    silver: data.fxOperationsDetails?.coinMetalType?.silver?.isSilver,
    silverOperationNumber: data.fxOperationsDetails?.coinMetalType?.silver?.mounthlySilverTransactions?.toString() ?? '',
    silverOperationAmount: data.fxOperationsDetails?.coinMetalType?.silver?.mounthlySilverAmount?.toString() ?? '',

    other: data.fxOperationsDetails?.coinMetalType?.other?.isOther,
    otherType: data.fxOperationsDetails?.coinMetalType?.other?.otherMetalType,
    otherOperationNumber: data.fxOperationsDetails?.coinMetalType?.other?.mounthlyOtherTransactions?.toString() ?? '',
    otherOperationAmount: data.fxOperationsDetails?.coinMetalType?.other?.mounthlyOtherAmount?.toString() ?? ''
  };
}


