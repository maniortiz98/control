export interface ApplicationData {
  id: number | null;
  workFlowAssignmentId: number | null;
  applicationNumber: string | null;
  curp: string | null;
  identification: Identification | null;
  client: Client | null;
  financialCenter: string | null;
  advisor: string | null;
  typeOperation: string | null;
  contract: Contract | null;
  createdDate: string | null;
  createdHour: string | null;
  statusId: number | null;
  repeat: RepeatEntry[] | null;
  data?: {
    profileUpd: string | null;
    profile: string | null;
  } | null;
}

export interface Identification {
  rfc: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
}

export interface Client {
  clientNumber: number | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  typePerson: string | null;
  genre: string | null;
  nacionality: string | null;
  stateId: string | null;
  rol: string | null;
  birthdate: string | null;
}

export interface Contract {
  bankingArea: string | null;
  contractId: number | null;
  contractNumber: string | null;
  contractType: string | null;
  subContractType: string | null;
}

export interface RepeatEntry {
  id: number | null;
  clientNumber: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  status: string | null;
  listName: string | null;
  stream: string | null;
}
