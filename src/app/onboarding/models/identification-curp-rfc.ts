export interface RequestIdentificationOld {
  rfc: string,
  curp: string
}

export interface RequestIdentificationNew {
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

export interface ChangesIdentification {
  old: RequestIdentificationOld,
  new: RequestIdentificationNew
}

export interface RequestIdentification {
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

export interface ResposeIdentification {
  idWorkFlowDetalle?: number,
  updates?: number
  timestamp?: string,
  status?: number,
  error?: string,
  message?: string,
  details?: string
}
