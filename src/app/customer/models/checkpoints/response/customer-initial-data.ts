export interface CustomerInitialData {
  curp: string;
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: number;
  nationality: string;
  countryOfBirth: string;
  stateOfBirth: string;
  cityOfBirth: string | null;
  ppe: boolean;
  foreignerWithoutCurp: boolean;
  bankAreaTypeId: string;
  contraTypeId: number;
  typeContractSubtypeId: number;
}

export interface CustomerInitialDataCustomer {
  id: number;
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
  stateOfBirth: string | null;
  cityOfBirth: string | null;
  ppe: boolean;
  foreignerWithoutCurp: boolean;
}



export type InitialData = CustomerInitialData;
export type InitialDataCustomer = CustomerInitialDataCustomer;

