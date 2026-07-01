export interface EnvFile {
  production: boolean;
  name: string;
  applicationId: string;
  allowLog: boolean;
  api: {
    host: string;
    catalogs: CatalogsEnvFile;
    services: ApisCatalog;
    salesPractices: ApisSalesPractice;
    homonyms: string;
    fiel: string;
    searchCustomer: string;
    searchApplication: string;
    watchlist: string;
    zipCode: string;
    assignmentDetail: string;
    take: string;
    updateStatus: string;
    detail: string;
    detailPld: string;
    detailCurpAndrfc: string;
    approvalHomoPf: string;
    unificationList: string;
    createWfHomoPf: string;
    identification: string;
    security: {
      accessToken: string;
      userLogin: string;
      userRoles: string;
    };
    registerOnboarding: string;
    openText: string;
    rePrintContracts: string;
    maintenance: {
      spineCatalogRetrieve: string;
      spineCatalogUpsert: string;
      replicateContract       : string;
      searchContractByCustomer: string;
      searchContractByNumber  : string;
      updateStatus            : string;
      updateStatusHistory     : string;
      equityRegister          : string;
      contractsAdvisor        : string;
      transferContracts       : string;
      replicateCustomer       : string;
    }
  };
  otcConfig: {
    disableOtcMail: boolean,
    disableOtcSms: boolean,
  },
  dynatrace: string;
  msalConfig: {
    auth: {
      clientId: string;
      authority: string;
      redirectUri: string;
    }
  };
  apiConfig: {
    scopes: Array<string>,
    uri: string;
  };
};

export interface CatalogsEnvFile {
  accountDocumentKit: string;
  accountStatement: string;
  accountRole: string;
  accountType: string;
  addressRole: string;
  addressType: string;
  advisor: string,
  amountRetreatsAvg: string;
  authorizedPerson: string;
  bank: string;
  branch: string;
  cfdi: string;
  classificationPerson: string;
  clientKnowledge: string;
  clientNoGuaranteedIpab: string;
  contract: string;
  contractTop: string;
  country: string;
  currencyType: string;
  districtMunicipality: string;
  documentType: string;
  economicActivity: string;
  economicActivityAccredited: string;
  economicSector: string;
  experienceTime: string;
  federalEntity: string;
  financialCenter: string;
  fiscalCertificate: string;
  fiscalRegime: string;
  fiscalPersonType: string;
  fiscalPersonSubType: string;
  fundsOriginCategory: string;
  internationalBanks: string;
  interviewPlace: string;
  identificationType: string;
  investmentType: string;
  maritalStatus: string;
  marriageType: string;
  monthlyDeposit: string;
  monthlyDepositAvg: string;
  nationality: string;
  occupations: string;
  origin_resource: string;
  paymentPeriod: string;
  personRole: string;
  personType: string;
  profileInvestment: string;
  proofOfAddressType: string;
  propertyType: string;
  phoneType: string;
  relationships: string;
  residentialArea: string;
  riskGroup: string;
  sector: string;
  serviceSubtype: string;
  serviceType: string;
  signatureType: string;
  taxId: string;
  transactionalLimits: string;
  startedWorking: string;
  subcontract: string;
  subsidiaries: string;
  strategiesEquity: string;
}

export interface ApisCatalog {
  otcSendSms: string;
  otcSendEmail: string;
  otcValidate: string;
  saveCheckpoint: string;
  saveCheckpointMant: string;
  saveCheckpointNonContract?: string;
  getCheckpoints: string;
  getCheckpointsMant: string;
  getCheckpointsCustomer: string;
  fielValidation: string;
  curpValidate:string;
  notifications: string;
}

export interface ApisSalesPractice {
  getQuiz: string;
  getQuizReprofilingUrl: string;
  getQuizRate: string;
  getQuizRateReprofilingUrl: string;
  getQuizRateConfirm: string;
  getProfilingDocument: string;
  generateWfReprofile: string;
}
