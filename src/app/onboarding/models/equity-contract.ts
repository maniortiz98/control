export interface CreationEquityContract {
  selectedContract: string,
  investmentAmmount: number,
}

export interface PreviewEquityContract {
  fatherContractNumber: string,
  fatherClientNumber: string,
  fatherFullName: string,
  childrenContractNumber: string,
  childrenClientNumber: string,
  childrenFullName: string,
  childrenStrategyType: string
}

export interface EquityRegistrationRequest {
  contract: string;
  bankingArea: string;
  cveStrategy: string;
  advisorId: string;
  amount: string;
}

export interface EquityRegistrationResponse {
  status: string;
  messages: string;
  customerReplication: boolean;
  data: {
    customerId: string;
    riskLevel: string;
    contracts: Array<{
      type: string;
      subType: string;
      strategy: string;
      contractNumber: string;
      contractId?: string;
    }>;
    members: Array<{
      type: string;
      clientId: string;
      firstName: string;
      lastName: string;
      secondLastName: string;
    }>;
  };
}

