import { CustomerEmailCheckpoint, CustomerIndentificationCheckpoint, CustomerTelephoneCheckpoint } from "../customer-identification-and-contact-checkpoint";

export interface CustomerIdentificationAndContactInfoCheckpointMant{
  manifestLetter: boolean;
  identifications: CustomerIndentificationCheckpointMant[]
  telephones: CustomerTelephoneCheckpointMant[];
  emails: CustomerEmailCheckpointMant[];
}

export interface CustomerIndentificationCheckpointMant extends CustomerIndentificationCheckpoint{
  id: string | null,
  active: boolean;
}

export interface CustomerTelephoneCheckpointMant extends CustomerTelephoneCheckpoint{
  id: string | null,
  active: boolean;
}

export interface CustomerEmailCheckpointMant extends CustomerEmailCheckpoint{
  id: string | null,
  active: boolean;
}



export type IdentificationAndContactInfoCheckpointMant = CustomerIdentificationAndContactInfoCheckpointMant;
export type IndentificationCheckpointMant = CustomerIndentificationCheckpointMant;
export type TelephoneCheckpointMant = CustomerTelephoneCheckpointMant;
export type EmailCheckpointMant = CustomerEmailCheckpointMant;


