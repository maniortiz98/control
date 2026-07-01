interface Contract {
  contractId: number;
  contractNumber: string;
  contractType: string;
  subContractType: string;
}

interface CreatedBy {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
}

export interface WorkflowAssignmentDetail {
  id: number;
  workFlowAssignmentId: number;
  applilcationNumber: string;
  clientNumber: string;
  contractNumberBank: Contract;
  stockExchangeContract: Contract;
  financialCenter: string;
  createdDate: string;
  status: string;
  createdBy: CreatedBy;
}

export interface RequestWorkflowAssignmentDetail {
  workFlowDetailId: number,
}
