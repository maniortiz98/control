interface StructuredNotes {
  structuredNotesStrategiesCp: boolean;
  accumulateRangeNoteMxn7Days: boolean;
  tiieNoteMxn196Days: boolean;
  accumulatedRangeNoteMxn196Days: boolean;
  europeanRangenoteUsd7Days: boolean;
  accumulatedRangeNoteUsd7Days: boolean;
  dntNoteUsd7Days: boolean;
}

interface CustomerClient {
  clientOperatesSic: boolean;
  clientOperatesStocks: boolean;
  clientHasMarginOperation: boolean;
  clientHasRetirementPlan: boolean;
  retirementPlanType: string;
  clientHasTrust: boolean;
  lenderInvestmentFunds: boolean;
}

interface GeneralFeatures {
  printAccountStatement: boolean;
  settlementAccount: boolean;
  employeeContract: boolean;
  contractUsedForCredit: boolean;
  creditType: string;
  restrictMoneyMarketOperations: boolean;
  restrictDespositWithdrawals: boolean;
  restrictTransfers: boolean;
  minimumMarketability: boolean;
  minimumMarketabilityClassification: string;
  highSpeedChannel: string;
  noMarketingRequired: boolean;
  stabilizationContracts: boolean;
  indicateSphisticatedClient: boolean;
  alphaInvestmentNumber: boolean;
}

interface Confirmations {
  selectAllConfirmations: boolean;
  treasuryDepositsWithdrawals: boolean;
  capitalMarketsTrading: boolean;
  moneyMarketsTrading: boolean;
  investmentFundsTrading: boolean;
}

interface Portfolio {
  portfolioManagementFee: boolean;
  portfolioManagementFeeType: string;
  contractOriginIsBank: string;
  alphaInvestment: boolean;
  alphaInvestmentPortfolio: string;
  alphaInvestmentPromoter: string;
  estam: boolean;
  privateWealthManagementContract: boolean;
  privateWealthManagementPortfolio: string;
  privateWealthManagementPromoter: string;
  assetManagement: boolean;
}

interface StockExchangeCapital {
  capitalMarketsRoutingEligibility: boolean;
  activationDate: string;
  activationUserCode: string;
  activationUserName: string;
  deactivationDate: string;
  deactivationUserCode: string;
  deactivationUserName: string;
  minimumPortfolioException: boolean;
  operatesHighSpeedChannel: boolean;
  qualifiedInvestorKey: string;
  repurchaseFundsContracts: boolean;
  omnibusContract: boolean;
  acceptAutoEntryOperations: boolean;
  acceptFacilitationOperations: boolean;
  operatesWarrant: boolean;
  shortSales: boolean;
  participatesGlobalBreakdown: boolean;
  operatesWithoutPurchasePowerPosition: boolean;
}

interface BankCapitals {
  operatesWarrant: boolean;
  shortSales: boolean;
  capitalMarketsRoutingEligibility: boolean;
  validityDate: string;
}

export interface CustomerActiwebDataCheckpoint {
  structuredNotes: StructuredNotes;
  client: CustomerClient;
  generalFeatures: GeneralFeatures;
  confirmations: Confirmations;
  portfolio: Portfolio;
  stockExchangeCapital: StockExchangeCapital;
  bankCapitals: BankCapitals;
}

export interface CustomerCheckpointDataActiweb {
  // Structured Notes section
  structuralStrategies: boolean;
  range7mxn: boolean;
  tiie196mxn: boolean;
  range196mxn: boolean;
  range7eu: boolean;
  range7usd: boolean;
  dnt7usd: boolean;

  // CustomerClient section
  clientSic: boolean;
  clientActions: boolean;
  clientMargin: boolean;
  clientPlan: boolean;
  clientFc: boolean;
  clientInvestment: boolean;
  planType: string;

  // General Features section
  accountStatement: boolean;
  liquidatingAccount: boolean;
  employeeContract: boolean;
  creditContract: boolean;
  rmmOps: boolean;
  rdw: boolean;
  creditType: string;
  minimumMarketability: boolean;
  restrictTransfers: boolean;
  noMarketingRequired: boolean;
  mmClass: string;
  highSpeedChannel: string;
  stabContracts: boolean;
  sophisticatedClient: boolean;
  alphaInvestment: boolean;

  // Confirmations section
  treasuryOperations: boolean;
  capitalDeskTrading: boolean;
  moneyDeskTrading: boolean;
  invFundsTrading: boolean;
  allConfirmations: boolean;

  // Portfolio section
  portfolioAdmin: boolean;
  portfolioSafeType: string;
  contractOriginBank: string;
  alphaInv: boolean;
  estacm: boolean;
  alphaInvPortType: string;
  alphaInvPromo: string;
  pwmContract: boolean;
  assetManagement: boolean;
  pwmPortfolio: string;
  pwmPromo: string;

  // Stock Exchange Capital section
  futEligCapDesk: boolean;
  // eligibilityDate: string;
  activationDate: string;
  activationUserCode: string;
  activationUserName: string;
  deactivationDate: string;
  deactivationUserCode: string;
  deactivationUserName: string;
  minPortException: boolean;
  highVelocityTrading: boolean;
  distributedClosed: string;
  repoAgreementFunds: boolean;
  facOpsPart: boolean;
  globalBdPart: boolean;
  warrantOperations: boolean;
  derivativeContracts: boolean;
  operateWithWarrant: boolean;
  purchPowerPos: boolean;
  shortSalesManagement: boolean;
  extRepoOpsPart: boolean;
  shortSalesMgmtAlt: boolean;
  routeEligCapDesk: boolean;
  validityDate: string;
}


export type ActiwebDataCheckpoint = CustomerActiwebDataCheckpoint;
export type CheckpointDataActiweb = CustomerCheckpointDataActiweb;

