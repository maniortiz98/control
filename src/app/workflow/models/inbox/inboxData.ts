
interface WorkFlow {
  id: number;
  name: string;
}

interface WorkflowStatus {
  id: number;
  description: string;
}

interface CauseWorkflowChange {
  id: number;
  cve: string;
  description: string;
}

interface Person {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
}

export interface AssignmentDetail {
  id: number;
  number: number;
  accountId: number;
  clientId: number;
  personType: number;
  description: string;
  operativeFlow: string;
  observations: string;
  rejectedReason: string;
  list: string;
  requestDate: string;
  responseDate: string;
  workFlow: WorkFlow;
  workflowStatus: WorkflowStatus;
  causeWorkflowChange: CauseWorkflowChange;
  createdBy: Person;
  approvedBy: Person;
}

export interface RequestWF{
  domainUser: string,
}

export interface RequestWfTake{
  workflowId: number,
  domainUser: string,
}

export interface ResponceWfTake{
  workflowId: number,
  name: string,
}

export interface RequestWfUpdate{
  workflowId: number,
  status: number,
  reasonRejection?: string,
}

export interface ResponceWfUpdate{
  workflowId: number,
  status: string,
}