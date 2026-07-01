interface GeneralData {
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

interface PpeRelative {
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

interface PersonPpe {
  id?: number | null; //Se envia en mantenimiento
  isPpe: boolean;
  ppeType: string;
  positionHeld: string;
  positionEndDate: string;
  hasppeRelatives: boolean;
  ppeRelatives: PpeRelative[];
}

interface AddressRealOwner {
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

export interface Data {
  generalData: GeneralData;
  personPpe: PersonPpe;
  addressRealOwner: AddressRealOwner;
}

export interface CompleteData {
  clientId: string;
  sectionId: string;
  data: Data;
}
