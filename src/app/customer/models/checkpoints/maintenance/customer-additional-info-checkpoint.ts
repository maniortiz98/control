export interface CustomerAdditionalInfoCheckpoint {
  addressKey:         string;
  sendingDocuments:   string;
  exemptIsr:          boolean;
  expirationDate:     string;
  w8Format:           boolean;
  w8DateList:         CustomerW8DateList[];
  locations:          string;
  typeMarketToInvest: CustomerTypeMarketToInvest;
}

export interface CustomerTypeMarketToInvest {
  exchangeOperations:               boolean;
  thirdPartyInvestmentSocieties:    boolean;
  investmentSocietiesOwn:           boolean;
  domesticForeignShares:            boolean;
  derivativesAndStructuredProducts: boolean;
  fixedIncomeSecurities:            boolean;
  savingsPlansWithTaxIncentives:    boolean;
}

export interface CustomerW8DateList {
  id?:      number;
  initDate: string;
  endDate:  string;
  active:   boolean;
}



export type AdditionalInfoCheckpoint = CustomerAdditionalInfoCheckpoint;
export type TypeMarketToInvest = CustomerTypeMarketToInvest;
export type W8DateList = CustomerW8DateList;

