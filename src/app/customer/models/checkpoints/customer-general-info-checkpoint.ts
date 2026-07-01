import { CustomerExecutorInfo, CustomerExecutorTableInfo } from '../customer-executor';
import { CustomerGeneralInfoContract } from '../customer-general-info';
import { CustomerContactDataMant, CustomerIdentificationMant } from "./maintenance/customer-signature-checkpoint-mant";
import { CustomerCoHolder, CustomerCoHolderBase } from "./customer-signature-checkpoint";

export interface CustomerCompleteGeneralInfoSection{
    contractSection: CustomerGeneralInfoContract | null,
    executorSection: CustomerGeneralInfoExecutorSection | null,
    clientSection: CustomerGeneralInfoSection,
}

export interface CustomerGeneralInfoExecutorSection {
  showExecutors: boolean,
  executors: CustomerExecutorInfo[],
  executorsTable: CustomerExecutorTableInfo[]
}

export interface CustomerGeneralInfoCheckpointOnboarding extends CustomerGeneralInfoCheckpoint{
  executors?: CustomerExecutor[]
}

export interface CustomerGeneralInfoCheckpoint {
    personClassification: string,
    economicActivity: string,
    maritalStatus: string,
    marriageType: string,
    sector: string,
    actinverEmployee: boolean,
    employeeNumber: string,
    occupation: string,

    profession: string,
    companyName: string,
    jobTitle: string,
    companyPhone: string,
    //companyWebPage: string,

    addressType: string,
    country: string,
    postalCode: string,

    federalEntity: string,
    city: string,
    municipality: string,
    neighborhood: string,

    street: string,
    externalNumber: string,
    internalNumber: string,

    website: string,

    related: boolean,
    relationship: string,
    institutionName: string,
    fiel: string,
    fielExpirationDate: string,
    otherAddress?: string | null
}

export interface CustomerGeneralInfoNonContractCheckpoint {
    personClassification: string,
    economicActivity: string,
    maritalStatus: string,
    marriageType: string,
    sector: string,
    actinverEmployee: boolean,
    employeeNumber: string,
    occupation: string,

    profession: string,
    companyName: string,
    jobTitle: string,
    companyPhone: string,

    addressType: string,
    address: {
        id: string,
        active: boolean,
        country: string,
        street: string,
        externalNumber: string,
        internalNumber: string,
        postalCode: string,
        federalEntity: string,
        city: string,
        municipality: string,
        neighborhood: string,
        otherAddress?: string | null
    },

    website: string,

    related: boolean,
    relationship: string,
    institutionName: string,
    fiel: string,
    fielExpirationDate: string
}

export interface CustomerGeneralInfoSection {
  personClassification: string,
  economicActivity: string,
  maritalStatus: string,
  marriageType?: string,
  sector: string,
  actinverEmployee: boolean,
  employeeNumber?: string,
  occupation: string,

  profession: string,
  companyName?: string,
  jobTitle?: string,
  companyPhone?: string,
  //companyWebPage?: string,

  domicilieType: string,
  addressId?: number | null,
  country: string,
  postalCode: string,

  federalEntity: string,
  federalEntityID: string,
  city: string,
  cityID: string,
  municipality: string,
  municipalityID: string,

  colony: string,
  street: string,
  externalNumber: string,
  internalNumber: string,

  website: string,

  related: boolean,
  relationship: string,
  institutionName: string,
  fiel: string,
  fielExpirationDate: string,
  isEquity?: boolean,
  hasSupplier?: boolean,
  acting?: boolean,
  otherAddress?: string | null,
}

export interface CustomerExecutor extends CustomerCoHolder{
}



export type CompleteGeneralInfoSection = CustomerCompleteGeneralInfoSection;
export type GeneralInfoExecutorSection = CustomerGeneralInfoExecutorSection;
export type GeneralInfoCheckpointOnboarding = CustomerGeneralInfoCheckpointOnboarding;
export type GeneralInfoCheckpoint = CustomerGeneralInfoCheckpoint;
export type GeneralInfoNonContractCheckpoint = CustomerGeneralInfoNonContractCheckpoint;
export type GeneralInfoSection = CustomerGeneralInfoSection;
export type Executor = CustomerExecutor;



