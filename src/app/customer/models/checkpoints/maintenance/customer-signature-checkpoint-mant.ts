import { CustomerCoHolderBase, CustomerIdentification, CustomerLegalProxyBase, CustomerRegisteredEmail, CustomerRegisteredPhone, CustomerSignatureDataCheckpointBase } from "../customer-signature-checkpoint";

export interface CustomerSignatureDataCheckpointMant extends CustomerSignatureDataCheckpointBase{
  id: number | null,
  coHolders:     CustomerCoHolderMant[];
  legalProxy:    CustomerLegalProxyMant[];
}

export interface CustomerCoHolderMant extends CustomerCoHolderBase{
  customerNumber:             number | null,
  coHolderId:                 number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             CustomerIdentificationMant[]
  contactData:                CustomerContactDataMant;
}

export interface CustomerLegalProxyMant extends CustomerLegalProxyBase{
  customerNumber:             number | null,
  legalProxyId:               number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             CustomerIdentificationMant[];
  contactData:                CustomerContactDataMant;
}

export interface CustomerContactDataMant {
  id?: number | null;
  dataNonDisclosureLetter: boolean;
  registeredPhones:        CustomerRegisteredPhoneMant[];
  registeredEmails:        CustomerRegisteredEmailMant[];
}

export interface CustomerRegisteredEmailMant extends CustomerRegisteredEmail {
  id: number | null,
  active: boolean
}

export interface CustomerRegisteredPhoneMant extends CustomerRegisteredPhone{
  id: number | null,
  active: boolean
}

export interface CustomerIdentificationMant extends CustomerIdentification{
  id: number | null,
  active: boolean
}



export type SignatureDataCheckpointMant = CustomerSignatureDataCheckpointMant;
export type CoHolderMant = CustomerCoHolderMant;
export type LegalProxyMant = CustomerLegalProxyMant;
export type ContactDataMant = CustomerContactDataMant;
export type RegisteredEmailMant = CustomerRegisteredEmailMant;
export type RegisteredPhoneMant = CustomerRegisteredPhoneMant;
export type IdentificationMant = CustomerIdentificationMant;

