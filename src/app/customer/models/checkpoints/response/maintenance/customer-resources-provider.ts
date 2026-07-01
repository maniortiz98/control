export interface DataResResourceProvider {
  generalData: CustomerGeneralData | null;
  personPpe: CustomerPersonPpe | null;
  resourceProviderAddress: CustomerAddressResourceProvider | null;
}

export interface CustomerGeneralData {
  foreignerWithoutCurp: boolean | null;
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
  relationship: string | null;
  economicActivity: string | null;
  fiel: string | null;
  expirationFielDate : string | null;
  phone: string | null;
  email: string | null;
  personType: string | null;
  cityOfBirth: string | null;
  countryFiscal: string | null;
  accountRoleId: number;
  active: boolean;
}

export interface CustomerPersonPpe {
  active: boolean | null;
  personPpeId: number;
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
  accountRole: number;
  active: boolean | null;
  countryFiscal: string | null;
  city: string | null;
}

export interface CustomerAddressResourceProvider {
  addressType: string | null;
  other: string | null;
  country: string | null;
  postalCode: string | null;
  federalEntity: string | null;
  municipality: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  externalNumber: string | null;
  internalNumber: string | null;
  addressId?: number;
}

export type DataResResourceProvider = DataResResourceProvider;
export type GeneralData = CustomerGeneralData;
export type PersonPpe = CustomerPersonPpe;
export type PpeRelative = CustomerPpeRelative;
export type AddressResourceProvider = CustomerAddressResourceProvider;

