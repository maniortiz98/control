export interface IdentificationAndContactInfoCheckpoint{
  manifestLetter: boolean;
  identifications: IndentificationCheckpoint[]
  telephones: TelephoneCheckpoint[];
  emails: EmailCheckpoint[];
}

export interface IndentificationCheckpoint{
  country: string;
  identificationType: string;
  identificationNumber: string;
  expirationDate: string;
}

export interface TelephoneCheckpoint {
  type: string;
  country: string;
  areaCode: string;
  phone: string;
  extension: string;
  notificationPhone: boolean
}

export interface EmailCheckpoint {
  emailAddress: string;
  notificationEmail: boolean;
}
