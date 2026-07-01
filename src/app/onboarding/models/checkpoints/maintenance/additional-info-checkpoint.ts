export interface AdditionalInfoCheckpoint {
  addressKey:         string;
  sendingDocuments:   string;
  exemptIsr:          boolean;
  expirationDate:     string;
  w8Format:           boolean;
  w8DateList:         W8DateList[];
  locations:          string;
  typeMarketToInvest: TypeMarketToInvest;
}

export interface TypeMarketToInvest {
  exchangeOperations:               boolean;
  thirdPartyInvestmentSocieties:    boolean;
  investmentSocietiesOwn:           boolean;
  domesticForeignShares:            boolean;
  derivativesAndStructuredProducts: boolean;
  fixedIncomeSecurities:            boolean;
  savingsPlansWithTaxIncentives:    boolean;
}

export interface W8DateList {
  id?:      number;
  initDate: string;
  endDate:  string;
  active:   boolean;
}
