export interface CustomerRequestWfReprofile {
  contractNumber: number;
  clientNumber: number;
  bankingArea: string;
  workflowId: string;
  workflowStatusId: number;
  userId?: string | null;
  workflowRequestNum: string;
  itemList: string;
  applicationId: number;
  origin: string;
  user: string;
  contract: string;
}

export interface CustomerResponseWfReprofile {
  workflowDetalleId: number
}

export type RequestWfReprofile = CustomerRequestWfReprofile;
export type ResponseWfReprofile = CustomerResponseWfReprofile;

