export interface CustomerGeneralInfoContract {
  id: number | null,

  personId: number,
  addressId: number,
  workDataId: number,
  clientId: number,
  accountRoleId: number,

  saleForceProspect?: string,
  clientStatus: string,
  contractStatus: string,
  openDate: string,

  initialRiskId: number,
  initialRiskDescription: string,
  modifyRiskId: number,
  modifyRiskDespcription: string,
  origin: string,
  n4UpdateDate: string,
  liverpoolDomicilie?: boolean,

  //operateChangesSinceOpen: boolean,
  isNumbered: boolean,
  operateCapitals: boolean,


  accountLevel?: string,
  contractDenomination?: string,
  PMContractBE?: boolean,
  h2hServices?: boolean,
  operateEuros?: boolean,
  independentAsesor?: string,

  checkProtected: boolean,
  isOwnPosition: boolean,
  isSocialPrevision: boolean,
  authorizationConsultCreditReports: boolean,
  biometricsAccount: boolean,
  facialBiometrics: boolean,
  enrollmentStatus: string,


  asociatedDirector: string,
  directPromote: string,
  financailCenter: string,

  isrPercentage: number,
  isrMonthlyCommision: number,
  comissionPercentage: number,

  trust?: number,
  clientHasTrust?: boolean,
  brokerageActinverTrust?: boolean,

  isPMSorety: boolean,
  isBrokerageHouse: boolean,

  accountManagementId: number | null,
  externalCustody: boolean,
  custody: string,
  custodyIndeval: string,
  financialCenterDelivery: string,
  contractManagement: string,
  gestionType: string,
  vip: boolean,
  strategyTypes: string[],

  generalInformationId: number | null,
  operationReason: string,
  otherReasons: string,
  operationConfiramtionMedia: string,

  documents: boolean,
  transfers: boolean,
  accountDeposit: boolean,
  other: boolean,
  otherPreferedProduct: string,

  associateDirectorId: number | null,
  asociatedDirectorStatus: string,
  asociatedDirectorFolio: string,
  asociatedDirectorNumber: number,
  asociatedDirectorName: string,

  geolocationId: number | null,
  consentGeolocalization: boolean,
  date: string,
  time: string,
  latitude: string,
  longitude: string,

  incapacity: boolean,
  incapacityLetter: boolean,
  dateOfDefunction: string,
}



export type GeneralInfoContract = CustomerGeneralInfoContract;

