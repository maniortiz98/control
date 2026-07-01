import { GeneralInfoCheckpoint } from "../general-info-checkpoint";
import { CoHolderBase } from "../signature-checkpoint";
import { ContactDataMant, IdentificationMant } from "./signature-checkpoint-mant";


export interface GeneralInfoPfMantCheckpoint extends GeneralInfoCheckpoint {
  contractData:            ContractData;
  accountManagement:       AccountManagement;
  generalInformation:      GeneralInformation;
  associateDirector:       AssociateDirector;
  geolocation:             Geolocation;
  otherData:               OtherData;

  personId: number,
  addressId: number,
  workDataId: number,
  clientId: number,
  accountRoleId: number,
  mensajesMt940: boolean,
  codigoSwiftBic: string,
  isEquity: boolean,
  executors?: ExecutorMant[],
}

export interface AccountManagement {
  id:                      number | null;
  externalCustody:         boolean;
  custody:                 string;
  indevalAccount:          string;
  financialCenterDelivery: string;
  contractManagement:      string;
  managementType:          string;
  vip:                     boolean;
  equityStrategies:        string[];
}

export interface AssociateDirector {
  id:                     number | null;
  directorStatus:         string;
  associateDirectorFolio: string;
  advisorNumber:          number;
  name:                   string;
}

export interface ContractData {
  id:                                number | null;
  customerStatus:                    string;
  applicationStatus:                 string;
  openingDate:                       string;
  initialRiskScore:                  number;
  initialRiskDescription:            string;
  modifiedRiskScore:                 number;
  modifiedRiskDescription:           string;
  origin:                            string;
  upgradeDateN4:                     string;
  numbered:                          boolean;
  //operatesCapital:                   boolean;
  checkProtection:                   boolean;
  properPosition:                    boolean;
  socialSecurity:                    boolean;
  biometricsAccount:                 boolean;
  facialBiometrics:                  boolean;
  enrollmentStatus:                  string;
  associateDirector:                 string;
  directPromoter:                    string;
  financialCenter:                   string;
  withholdingTax:                    string;
  creditSuisseCommission:            string;
  commissionPercentage:              string;
  legalEntityIGuarantor:             boolean;
  brokerageHouse:                    boolean;
  authorizationConsultCreditReports: boolean;
}

export interface GeneralInformation {
  id:                     number | null;
  reasonOperations:       string;
  otherReasonOperations:  string;
  confirmationAuthorized: string;
  referringProduct:       ReferringProduct;
}

export interface ReferringProduct {
  documents:               boolean;
  transfers:               boolean;
  depositInAccount:        boolean;
  other:                   boolean;
  SpecifyPreferredProduct: string;
}

export interface Geolocation {
  id:                 number | null;
  geolocationConsent: boolean;
  date:               string;
  hour:               string;
  latitude:           string;
  longitude:          string;
}

export interface OtherData {
  incapacity:              boolean;
  disabilityJustification: boolean;
  dateOfDeath:             string;
}

export interface ExecutorMant extends CoHolderBase{
  executorId:                 number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             IdentificationMant[]
  contactData:                ContactDataMant;
}
