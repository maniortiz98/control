export interface HomonymsResponse {
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  rfc: string;
  curp: string;
  percentSimilarity: number;
  url?: string;
  clientNumber : string;
}


export interface HomonymsRequest {
  channelId: string,
  applicationId: string,
  personType: number,
  name: string,
  middleName: string,
  lastName: string,
  secondLastName: string,
  birthDate: string,
  rfc: string,
  curp: string,
  nif: string,
  tin: string,
  nss: string,
  birthPlace: string;
  // gender?: string,
  // federalEntity: string
}

export interface WorkflowHomonymsRequest {
  workflowDescription: string;
  clientList: string;
  advisor: {
    advisorId: string;
  };
  unificationData: {
    personType: string;
  };
}

export interface WorkflowHomonymsResponse {
  idWorkflowDetalle: number,
  idWorkflowUnificacion: number
}

export interface HomonymsResponseData {
  passOnHomonyms: boolean,
  numberClient?: number | null
}
