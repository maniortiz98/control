export interface Data {
  id?: number,
  curp: string,
  nif: string,
  tin: string,
  nss: string,
  rfc: string,
  firstName: string,
  middleName: string,
  firstLastName: string,
  secondLastName: string,
  dateOfBirth: string,
  gender: string | number,
  nationality: string,
  countryOfBirth: string,
  stateOfBirth: string,
  cityOfBirth: string,
  ppe: boolean,
  foreignerWithoutCurp: boolean,
  bankAreaTypeId?: string,
  contraTypeId?: number,
  typeContractSubtypeId?: number,
  relatedContract?: RelatedContract
}

interface RelatedContract {
  number: number;
  type: number;
  subType: number;
}
