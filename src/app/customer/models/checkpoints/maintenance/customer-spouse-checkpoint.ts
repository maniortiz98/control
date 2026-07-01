interface CustomerSpouseData {
  id?: number;
  personId?: number;
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
  id?: number;
  occupation: string;
  businessActivity: string;
}

interface AddressSpouse {
  addresId?: number;
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
    id?: number;
    personId?: number;
  },
  WorkingFieldsSpouseId: {
    id?: number;
  },
  AddressSpouseId: {
    addresId?: number;
  }
}

export interface DataSpouse2 {
  spousedata: CustomerSpouseData;
  workingfields: WorkingFieldsSpouse;
  address: AddressSpouse;
}



export type DataSpouse = DataSpouse2;

