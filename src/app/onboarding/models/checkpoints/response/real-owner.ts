export interface DataResRealOwner {
  generalData: GeneralData | null;
  personPpe: PersonPpe | null;
  addressRealOwner: AddressRealOwner | null;
}

export interface GeneralData {
  foreignWithoutCURP: boolean | null;
  curp: string | null;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  firstName: string | null;
  middleName: string | null;
  firstLastName: string | null;
  secondLastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  countryOfBirth: string | null;
  federalEntity: string | null;
  relationship: number | null;
  economicActivity: string | null;
  fiel: string | null;
  fielExpirationDate: string | null;
  phone: number | null;
  email: string | null;
}

export interface PersonPpe {
  isPpe: boolean | null;
  ppeType: string | null;
  positionHeld: string | null;
  positionEndDate: string | null;
  hasppeRelatives: boolean | null;
  ppeRelatives: PpeRelative[] | null;
}

export interface PpeRelative {
  curp: string | null;
  foreignerWithoutCurp: boolean | null;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  firstName: string | null;
  middleName: string | null;
  firstLastName: string | null;
  secondLastName: string | null;
  nationality: string | null;
  countryOfBirth: string | null;
  relationship: number | null;
  positionHeld: string | null;
  positionEndDate: string | null;
  dateOfBirth: string | null;
  federalEntity: string | null;
}

export interface AddressRealOwner {
  addressType: string | null;
  other: string | null;
  country: string | null;
  postalCode: number | null;
  federalEntity: string | null;
  municipality: string | null;
  city: string | null;
  neighborhood: number | null;
  street: string | null;
  externalNumber: number | string | null;
  internalNumber: string | null;
}
