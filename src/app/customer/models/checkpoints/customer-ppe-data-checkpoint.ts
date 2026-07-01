export interface CustomerEconomicDependent {
  foreignerWithoutCurp: boolean;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  rfc: string,
  nif: string,
  tin: string,
  nss: string,
  maritalStatus: number,
  countryOfBirth: string,
  stateOfBirth: string,
  cityOfBirth: string,
  occupation: string,
  economicActivity: string,
  curp: string;
  dateOfBirth: string;
  addressType: string;
  other: string;
  country: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
  postalCode: string;
  federalEntity: string;
  city: string;
  municipality: string;
  neighborhood: string;
  relationship: number;
  nationality: string;
  phone: string;
  id?: number | null ;
  personId?: number | null;
  phoneId?: number | null;
  accountRoleId?: number | null;
  active?: boolean | null; // Puede que la cambien es el borrado logico
  addressId?: number | null;
  clientIdNum?:number | null;
}

export interface CustomerAssociation {
  companyName: string;
  rfc: string;
  commercialLine: string;
  economicActivity: string;
  administratorName: string;
  nationality: string;
  addressType: string;
  other: string;
  country: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
  postalCode: string;
  federalEntity: string;
  city: string;
  municipality: string;
  neighborhood: string;
  phone: string;
  id?: number | null,
  personId?: number | null,
  phoneId?: number | null,
  active?: boolean | null, // Puede que la cambien es el borrado logico
  addressId?: number |null,
  constitutionDate?: string | null
  clientIdNum?:number | null;
}

export interface CustomerFamilyData {
  foreignerWithoutCurp: boolean;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  positionHeld: string;
  positionHeldEndDate: string;
  relationship: number;
  nationality: string;
  rfc: string;
  nif: string,
  tin: string,
  nss: string,
  curp: string;
  dateOfBirth: string;
  maritalStatus: number;
  countryOfBirth: string;
  federalEntity: string;
  city: string;
  id?: number | null,
  personId?: number | null ,
  accountRole?: number | null,
  active?: boolean | null, // Puede que la cambien es el borrado logico
  addressId?: number | null,
}

export interface CustomerProfileData {
  id?: number,
  ppeType: string;
  positionHeld: string;
  expirationDate: string;
  isPpe: boolean,
  hasEconomicDependents: boolean,
  hasAssociations: boolean,
  hasFamilyPpe: boolean,
  economicDependents: CustomerEconomicDependent[];
  associations: CustomerAssociation[];
  familyData: CustomerFamilyData[];
}

export interface CustomerBasicPpeCheckpoint {
  isPpe: boolean,
  ppeType: string,
  positionHeld: string,
  positionEndDate: string,
  hasppeRelatives: boolean,
  ppeRelatives: [
    {
      rfc: string,
      firstName: string,
      firstLastName: string,
      relationship: number,
      positionHeld: string,
      positionEndDate: string
    }
  ]
}



export type EconomicDependent = CustomerEconomicDependent;
export type Association = CustomerAssociation;
export type FamilyData = CustomerFamilyData;
export type ProfileData = CustomerProfileData;
export type BasicPpeCheckpoint = CustomerBasicPpeCheckpoint;

