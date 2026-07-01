interface CustomerGeneralData {
  personType: string;
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  country: string;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: number;
  nationality: string;
  countryOfBirth: string;
  federalEntity: string;
  cityOfBirth: string;
  countryFiscal: string;
  relationship: number;
  economicActivity: string;
  fiel: string;
  expirationFielDate: string;
  phone: string;
  email: string;

  accountRoleId?: number; // Campo nuevo
  active?: boolean; // Campo nuevo
}

interface CustomerPpeRelative {
  //Aqui faltan dos campos active y id de back para la eliminacion logica
  accountRoleId?: number; // Campo mock para logica solo remplazar nombre
  active?: boolean | null; // Campo mock para logica solo remplazar nombre

  curp: string,
  foreignerWithoutCurp: boolean,
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
  countryFiscal: string;
  relationship: number;
  positionHeld: string;
  positionEndDate: string;
}

interface CustomerPersonPpe {
  active?: boolean | null; // Campo nuevo
  personPpeId?: number; // Campo nuevo
  isPpe: boolean;
  ppeType: string;
  positionHeld: string;
  positionEndDate: string;
  hasppeRelatives: boolean;
  ppeRelatives: CustomerPpeRelative[];
}

interface ResourceProviderAddress {
  addressId?: number; // Campo nuevo
  addressType: string;
  other: string;
  country: string;
  postalCode: string;
  federalEntity: string;
  city: string;
  municipality: string;
  neighborhood: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
}

export interface CustomerData {
  generalData: CustomerGeneralData;
  personPpe: CustomerPersonPpe;
  resourceProviderAddress: ResourceProviderAddress;
}

export interface CustomerCompleteData {
  clientId: string;
  sectionId: string;
  data: Data;
}



export type Data = Data;
export type CompleteData = CustomerCompleteData;

