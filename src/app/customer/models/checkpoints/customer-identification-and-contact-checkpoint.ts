export interface CustomerIdentificationAndContactInfoCheckpoint{
  manifestLetter: boolean;
  identifications: CustomerIndentificationCheckpoint[]
  telephones: CustomerTelephoneCheckpoint[];
  emails: CustomerEmailCheckpoint[];
}

export interface CustomerIndentificationCheckpoint{
  country: string;
  identificationType: string;
  identificationNumber: string;
  expirationDate: string;
}

export interface CustomerTelephoneCheckpoint {
  type: string;
  country: string;
  areaCode: string;
  phone: string;
  extension: string;
  notificationPhone: boolean
}

export interface CustomerEmailCheckpoint {
  emailAddress: string;
  notificationEmail: boolean;
}

export type IdentificationAndContactInfoCheckpoint = CustomerIdentificationAndContactInfoCheckpoint;
export type IndentificationCheckpoint = CustomerIndentificationCheckpoint;
export type TelephoneCheckpoint = CustomerTelephoneCheckpoint;
export type EmailCheckpoint = CustomerEmailCheckpoint;

