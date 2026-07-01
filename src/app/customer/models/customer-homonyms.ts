export interface CustomerHomonymsResponse {
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


export interface CustomerHomonymsRequest {
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

export interface CustomerWorkflowHomonymsRequest {
  workflowDescription: string;
  clientList: string;
  advisor: {
    advisorId: string;
  };
  unificationData: {
    personType: string;
  };
}

export interface CustomerWorkflowHomonymsResponse {
  idWorkflowDetalle: number,
  idWorkflowUnificacion: number
}

export interface CustomerHomonymsResponseData {
  passOnHomonyms: boolean,
  numberClient?: number | null
}
export type HomonymsResponse = CustomerHomonymsResponse;
export type HomonymsRequest = CustomerHomonymsRequest;
export type WorkflowHomonymsRequest = CustomerWorkflowHomonymsRequest;
export type WorkflowHomonymsResponse = CustomerWorkflowHomonymsResponse;
export type HomonymsResponseData = CustomerHomonymsResponseData;

