export interface DataResRealOwner {
  generalData: CustomerGeneralData | null;
  personPpe: CustomerPersonPpe | null;
  addressRealOwner: CustomerAddressRealOwner | null;
}

export interface CustomerGeneralData {
  personType: string | null;
  rolAccountId: number | null;
  personId: number | null;
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
  countryFiscal: string | null;
  federalEntity: string | null;
  cityOfBirth: string | null;
  relationship: number | null;
  economicActivity: string | null;
  fiel: string | null;
  fielExpirationDate: string | null;
  phone: string | null;
  email: string | null;
}

export interface CustomerPersonPpe {
  id: number;
  isPpe: boolean | null;
  ppeType: string | null;
  positionHeld: string | null;
  positionEndDate: string | null;
  hasppeRelatives: boolean | null;
  ppeRelatives: CustomerPpeRelative[] | null;
}

export interface CustomerPpeRelative {
  id: number;
  personId: number;
  active: boolean;
  accountRoleId: number;
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
  countryFiscal: string | null;
}

export interface CustomerAddressRealOwner {
  addressId : string;
  addressType: string | null;
  other: string | null;
  country: string | null;
  postalCode: string | null;
  federalEntity: string | null;
  municipality: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  externalNumber: number | string | null;
  internalNumber: string | null;
}



export type DataResRealOwner = DataResRealOwner;
export type GeneralData = CustomerGeneralData;
export type PersonPpe = CustomerPersonPpe;
export type PpeRelative = CustomerPpeRelative;
export type AddressRealOwner = CustomerAddressRealOwner;

