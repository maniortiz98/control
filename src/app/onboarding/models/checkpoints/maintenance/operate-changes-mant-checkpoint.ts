import { FxOperationsDetails } from "../operate-changes-checkpoint"

export interface OperateChangesCheckpointMant {
  fxOperationReasons: FxOperationReasons,
  fxOperationsDetails: FxOperationsDetailsMant,
}

export interface FxOperationsDetailsMant extends FxOperationsDetails{
  id: number,
}

export interface FxOperationReasons {
  id: number,
  fxMetalsInvestments: boolean,
  curreencyTrading: boolean,
  importExport: {
    isImportExport: boolean,
    countryOrigin: string,
    countryDestination: string
  },
  personalFundsReceipt: {
    isPersonalFundsReceipt: boolean,
    originCountry: string,
    countryDestination: string
  },
  settlementToSuppliersAbroad: {
    isSettlementToSuppliersAbroad: boolean,
    destinationCountry: string
  },
  receiptOrSendingDonations: {
    isReceiptOrSendingDonations: boolean,
    originCountry: string,
    countryDestination: string
  },
  forInvestment: {
    isForInvestment: boolean,
    originCountry: string,
    countryDestination: string,
  },
  settlementOfFinancialOperations: {
    isSettlementOfFinancialOperations: boolean,
    destinationCountry: string
  }
  clientPaymentReceipt: {
    isClientPaymentReceipt: boolean,
    provenanceCountry: string
  }
}
