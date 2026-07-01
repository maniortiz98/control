interface CustomerGeneralData {
  rolAccountId?: number | null; //Se envia en mantenimiento
  personId?: number | null; //Se envia en mantenimiento
  personType: string,
  foreignWithoutCURP: boolean;
  curp: string;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  countryFiscal: string;
  cityOfBirth: string;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: number | string;
  nationality: string;
  countryOfBirth: string;
  federalEntity: string;
  relationship: number | string;
  economicActivity: string;
  fiel: string;
  fielExpirationDate: string;
  phone: number | string;
  email: string;
}

interface CustomerPpeRelative {
  id?: string | number | null;  //Se envia en mantenimiento
  personId?: number;  //Se envia en mantenimiento
  accountRoleId?: number;
  active?: boolean; //Se envia en mantenimiento
  countryFiscal: string;
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  nationality: string;
  countryOfBirth: string;
  relationship: number | string;
  positionHeld: string;
  positionEndDate: string;
  dateOfBirth: string;
  federalEntity: string;
}

interface CustomerPersonPpe {
  id?: number | null; //Se envia en mantenimiento
  isPpe: boolean;
  ppeType: string;
  positionHeld: string;
  positionEndDate: string;
  hasppeRelatives: boolean;
  ppeRelatives: CustomerPpeRelative[];
}

interface CustomerAddressRealOwner {
  addressId?: string | number, //Se envia en mantenimiento
  addressType: string;
  other: string;
  country: string;
  postalCode: number | string;
  federalEntity: string;
  city: string;
  municipality: string;
  neighborhood: number | string;
  street: string;
  externalNumber: number | string;
  internalNumber: string;
}

export interface CustomerData {
  generalData: CustomerGeneralData;
  personPpe: CustomerPersonPpe;
  addressRealOwner: CustomerAddressRealOwner;
}

export interface CustomerCompleteData {
  clientId: string;
  sectionId: string;
  data: Data;
}



export type Data = Data;
export type CompleteData = CustomerCompleteData;

