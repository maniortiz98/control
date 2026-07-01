import { CustomerGeneralInfoCheckpoint } from '../customer-general-info-checkpoint';
import { CustomerCoHolderBase } from "../customer-signature-checkpoint";
import { CustomerContactDataMant, CustomerIdentificationMant } from "./customer-signature-checkpoint-mant";


export interface CustomerGeneralInfoPfMantCheckpoint extends CustomerGeneralInfoCheckpoint {
  contractData:            CustomerContractData;
  accountManagement:       CustomerAccountManagement;
  generalInformation:      CustomerGeneralInformation;
  associateDirector:       CustomerAssociateDirector;
  geolocation:             CustomerGeolocation;
  otherData:               CustomerOtherData;

  personId: number,
  addressId: number,
  workDataId: number,
  clientId: number,
  accountRoleId: number,
  executors?: CustomerExecutorMant[],
}

export interface CustomerAccountManagement {
  id:                      number | null;
  externalCustody:         boolean;
  custody:                 string;
  indevalAccount:          string;
  financialCenterDelivery: string;
  contractManagement:      string;
  managementType:          string;
  vip:                     boolean;
}

export interface CustomerAssociateDirector {
  id:                     number | null;
  directorStatus:         string;
  associateDirectorFolio: string;
  advisorNumber:          number;
  name:                   string;
}

export interface CustomerContractData {
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

export interface CustomerGeneralInformation {
  id:                     number | null;
  reasonOperations:       string;
  otherReasonOperations:  string;
  confirmationAuthorized: string;
  referringProduct:       CustomerReferringProduct;
}

export interface CustomerReferringProduct {
  documents:               boolean;
  transfers:               boolean;
  depositInAccount:        boolean;
  other:                   boolean;
  SpecifyPreferredProduct: string;
}

export interface CustomerGeolocation {
  id:                 number | null;
  geolocationConsent: boolean;
  date:               string;
  hour:               string;
  latitude:           string;
  longitude:          string;
}

export interface CustomerOtherData {
  incapacity:              boolean;
  disabilityJustification: boolean;
  dateOfDeath:             string;
}

export interface CustomerExecutorMant extends CustomerCoHolderBase{
  executorId:                 number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             CustomerIdentificationMant[]
  contactData:                CustomerContactDataMant;
}



export type GeneralInfoPfMantCheckpoint = CustomerGeneralInfoPfMantCheckpoint;
export type AccountManagement = CustomerAccountManagement;
export type AssociateDirector = CustomerAssociateDirector;
export type ContractData = CustomerContractData;
export type GeneralInformation = CustomerGeneralInformation;
export type ReferringProduct = CustomerReferringProduct;
export type Geolocation = CustomerGeolocation;
export type OtherData = CustomerOtherData;
export type ExecutorMant = CustomerExecutorMant;


