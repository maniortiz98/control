export interface DataResResourceProvider {
  generalData: CustomerGeneralData | null;
  personPpe: CustomerPersonPpe | null;
  resourceProviderAddress: CustomerAddressResourceProvider | null;
}

export interface CustomerGeneralData {
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
  personType: string | null;
}

export interface CustomerPersonPpe {
  isPpe: boolean | null;
  ppeType: string | null;
  positionHeld: string | null;
  positionEndDate: string | null;
  hasppeRelatives: boolean | null;
  ppeRelatives: CustomerPpeRelative[] | null;
}

export interface CustomerPpeRelative {
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

export interface CustomerAddressResourceProvider {
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


export type GeneralData = CustomerGeneralData;
export type PersonPpe = CustomerPersonPpe;
export type PpeRelative = CustomerPpeRelative;
export type AddressResourceProvider = CustomerAddressResourceProvider;

