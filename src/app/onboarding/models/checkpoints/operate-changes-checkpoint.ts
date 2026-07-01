export interface OperateChangesCheckpoint {
  fxOperationReasons: FxOperationReasons,
  fxOperationsDetails: FxOperationsDetails,
}

export interface FxOperationReasons {
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
  }
}

export interface FxOperationsDetails {
  transactionType: {
    cash: {
      isChash: boolean,
      mounthlyCashTransactions: number | null,
      mounthlyCashAmount: number | null
    },
    transfer: {
      isTransfer: boolean,
      mounthlyTransferTransactions: number | null,
      mounthlyTransferAmount: number | null
    },
    document: {
      isDocument: boolean,
      mounthlyDocumentTransactions: number | null,
      mounthlyDocumentAmount: number | null
    },
    travelerCheck: {
      isTravelerCheck: boolean,
      mounthlyTravelerCheckTransactions: number | null,
      mounthlyTravelerCheckAmount: number | null
    },
  },
  coinMetalType: {
    gold: {
      isGold: boolean,
      mounthlyGoldTransactions: number | null,
      mounthlyGoldAmount: number | null
    },
    silver: {
      isSilver: boolean,
      mounthlySilverTransactions: number | null,
      mounthlySilverAmount: number | null
    },
    other: {
      isOther: boolean,
      otherMetalType: string,
      mounthlyOtherTransactions: number | null,
      mounthlyOtherAmount: number | null
    },
  }
}
