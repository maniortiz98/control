interface SpouseData {
  id?: number|null;
  personId?: number|null;
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  nif: string;
  tin: string;
  nss: string;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: string;
}

interface WorkingFieldsSpouse {
  id?: number|null;
  occupation: string;
  businessActivity: string;
}

interface AddressSpouse {
  id?: number|null;
  addressType: string;
  other: string;
  country: string;
  federalEntity: string;
  postalCode: string;
  city: string;
  municipality: string;
  neighborhood: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
}

export interface DataSpouseId {
  SpouseDataId: {
    id?: number|null;
    personId?: number|null;
  },
  WorkingFieldsSpouseId: {
    id?: number|null;
  },
  AddressSpouseId: {
    id?: number|null;
  }
}

export interface DataSpouse {
  spousedata: SpouseData;
  workingfields: WorkingFieldsSpouse;
  address: AddressSpouse;
}
