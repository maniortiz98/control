export interface CustomerInitialDataM {
  id: number;
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



export type InitialDataM = CustomerInitialDataM;

