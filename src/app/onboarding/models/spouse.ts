
export interface Spouse {
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

interface Address {
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

export interface SpouseData {
  generalData: Spouse;
  adrres: Address;
}