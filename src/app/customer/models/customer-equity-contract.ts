export interface CustomerCreationEquityContract{
  selectedContract: string,
  investmentAmmount: number,
}

export interface CustomerPreviewEquityContract{
  fatherContractNumber: string,
  fatherClientNumber: string,
  fatherFullName: string,
  childrenContractNumber: string,
  childrenClientNumber: string,
  childrenFullName: string,
  childrenStrategyType: string
}

export interface CustomerEquityRegistrationRequest {
  contract: string;
  bankingArea: string;
  cveStrategy: string;
  advisorId: string;
  amount: string;
}

export interface CustomerEquityRegistrationResponse {
  status: string;
  messages: string;
  customerReplication: boolean;
  data: {
    id: string;
    riskLevel: string;
    contracts: Array<{
      type: string;
      subType: string;
      strategy: string;
      contractNumber: string;
      contractId?: string;
    }>;
  };
}



export type CreationEquityContract = CustomerCreationEquityContract;
export type PreviewEquityContract = CustomerPreviewEquityContract;
export type EquityRegistrationRequest = CustomerEquityRegistrationRequest;
export type EquityRegistrationResponse = CustomerEquityRegistrationResponse;

