import { CoHolderBase, CoHolderBaseMant, Identification, LegalProxyBase, RegisteredEmail, RegisteredPhone, SignatureDataCheckpointBase } from "../signature-checkpoint";

export interface SignatureDataCheckpointMant extends SignatureDataCheckpointBase{
  id: number | null,
  coHolders:     CoHolderMant[];
  legalProxy:    LegalProxyMant[];
}

export interface CoHolderMant extends CoHolderBaseMant{
  customerNumber:             number | null,
  coHolderId:                 number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             IdentificationMant[]
  contactData:                ContactDataMant;
}

export interface LegalProxyMant extends LegalProxyBase{
  customerNumber:             number | null,
  legalProxyId:               number | null,
  personId:                   number | null,
  active:                     boolean,
  identification:             IdentificationMant[];
  contactData:                ContactDataMant;
}

export interface ContactDataMant {
  id?: number | null;
  dataNonDisclosureLetter: boolean;
  registeredPhones:        RegisteredPhoneMant[];
  registeredEmails:        RegisteredEmailMant[];
}

export interface RegisteredEmailMant extends RegisteredEmail {
  id: number | null,
  active: boolean
}

export interface RegisteredPhoneMant extends RegisteredPhone{
  id: number | null,
  active: boolean
}

export interface IdentificationMant extends Identification{
  id: number | null,
  active: boolean
}
