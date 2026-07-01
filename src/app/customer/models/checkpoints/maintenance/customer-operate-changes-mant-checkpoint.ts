import { CustomerFxOperationsDetails } from "../customer-operate-changes-checkpoint"

export interface CustomerOperateChangesCheckpointMant {
  fxOperationReasons: CustomerFxOperationReasons,
  fxOperationsDetails: CustomerFxOperationsDetailsMant,
}

export interface CustomerFxOperationsDetailsMant extends CustomerFxOperationsDetails{
  id: number,
}

export interface CustomerFxOperationReasons {
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
    countryOrigin: string,
    countryDestination: string
  },
  forInvestment: {
    isForInvestment: boolean,
    countryOrigin: string,
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



export type OperateChangesCheckpointMant = CustomerOperateChangesCheckpointMant;
export type FxOperationsDetailsMant = CustomerFxOperationsDetailsMant;
export type FxOperationReasons = CustomerFxOperationReasons;


