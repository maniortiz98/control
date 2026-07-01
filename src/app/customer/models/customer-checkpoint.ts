export interface CustomerSaveCheckpointResponse {
    applicationNumber: any;
    sectionId: string;
    status: string;
    data?: CustomerContractData;
};

export interface CustomerSaveCheckpointMantResponse {
    applicationNumber: any;
    sectionId: string;
    status: string;
};

export interface CustomerContractData {
    contracts: CustomerContract[];
};

export interface CustomerContract {
    titular: string;
    number: string;
    rfc: string;
    type: string;
    subType: string;
    date: string;
};
export type SaveCheckpointResponse = CustomerSaveCheckpointResponse;
export type SaveCheckpointMantResponse = CustomerSaveCheckpointMantResponse;
export type ContractData = CustomerContractData;
export type Contract = CustomerContract;

