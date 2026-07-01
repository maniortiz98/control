export interface RequestWfReprofile {
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

export interface ResponseWfReprofile {
  workflowDetalleId: number
}
