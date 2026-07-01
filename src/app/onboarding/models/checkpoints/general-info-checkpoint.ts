import { ExecutorInfo, ExecutorTableInfo } from "../executor";
import { GeneralInfoContract } from "../general-info";
import { ContactDataMant, IdentificationMant } from "./maintenance/signature-checkpoint-mant";
import { CoHolder, CoHolderBase } from "./signature-checkpoint";

export interface CompleteGeneralInfoSection{
    contractSection: GeneralInfoContract | null,
    executorSection: GeneralInfoExecutorSection | null,
    clientSection: GeneralInfoSection,
}

export interface GeneralInfoExecutorSection {
  showExecutors: boolean,
  executors: ExecutorInfo[],
  executorsTable: ExecutorTableInfo[]
}

export interface GeneralInfoCheckpointOnboarding extends GeneralInfoCheckpoint{
  executors?: Executor[]
}

export interface GeneralInfoCheckpoint {
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
    operatesChanges: boolean,
    banxicoAuthorization: string,
    nonGuaranteedByIPAB: string,
    acting: boolean,
    hasSupplier: boolean,
}

export interface GeneralInfoSection {
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
  operatesChanges: boolean,
  banxicoAuthorization: string,
  nonGuaranteedByIPAB: string,
  acting?: boolean,
  hasSupplier?: boolean,
  mensajesMt940?: boolean,
  codigoSwiftBic?: string,
  isEquity?: boolean,
}

export interface Executor extends CoHolder{
}


