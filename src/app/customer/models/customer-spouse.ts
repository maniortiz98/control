
export interface CustomerSpouse {
  curp: string;
  foreignerWithoutCurp: boolean;
  typeIden: string;
  rfc: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  firstLastName: string;
  secondLastName: string;
  gender: string;
  occupation: string;
  economicActivity: string;
}

interface CustomerAddress {
  addressType: string,
  other?: string,
  country: string,
  postalCode: string,
  federalEntity: string,
  city: string,
  municipality: string,
  neighborhood: string,
  street: string,
  externalNumber: string,
  internalNumber?: string,
  federalEntityID?: string,
  cityID?: string,
  municipalityID?: string,
}

export interface CustomerSpouseData {
  generalData: CustomerSpouse;
  adrres: CustomerAddress;
}
export type Spouse = CustomerSpouse;
export type SpouseData = CustomerSpouseData;

