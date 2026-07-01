export interface CustomerRequestIdentificationOld {
  rfc: string,
  curp: string
}

export interface CustomerRequestIdentificationNew {
  clientNumber: number,
  firstName: string,
  lastName: string,
  secondLastName: string,
  secondName: string,
  gender: string,
  birthDate: string,
  birthState: string,
  typeIden: string,
  rfc: string,
  curp: string
}

export interface CustomerChangesIdentification {
  old: CustomerRequestIdentificationOld,
  new: CustomerRequestIdentificationNew
}

export interface CustomerRequestIdentification {
  clientNumber: number,
  nameOrBusinessName: string,
  lastName: string,
  secondLastName: string,
  secondName: string,
  genderId: string,
  birthDate: string,
  birthStateId: string,
  rfc: string,
  curp: string,
  user: string
}

export interface CustomerResposeIdentification {
  idWorkFlowDetalle?: number,
  updates?: number
  timestamp?: string,
  status?: number,
  error?: string,
  message?: string,
  details?: string
}

export type RequestIdentificationOld = CustomerRequestIdentificationOld;
export type RequestIdentificationNew = CustomerRequestIdentificationNew;
export type ChangesIdentification = CustomerChangesIdentification;
export type RequestIdentification = CustomerRequestIdentification;
export type ResposeIdentification = CustomerResposeIdentification;

