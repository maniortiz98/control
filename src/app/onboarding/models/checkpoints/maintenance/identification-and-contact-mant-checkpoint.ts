import { EmailCheckpoint, IndentificationCheckpoint, TelephoneCheckpoint } from "../identification-and-contact-checkpoint";

export interface IdentificationAndContactInfoCheckpointMant{
  manifestLetter: boolean;
  identifications: IndentificationCheckpointMant[]
  telephones: TelephoneCheckpointMant[];
  emails: EmailCheckpointMant[];
}

export interface IndentificationCheckpointMant extends IndentificationCheckpoint{
  id: number | null,
  active: boolean;
}

export interface TelephoneCheckpointMant extends TelephoneCheckpoint{
  id: number | null,
  active: boolean;
}

export interface EmailCheckpointMant extends EmailCheckpoint{
  id: number | null,
  active: boolean;
}
