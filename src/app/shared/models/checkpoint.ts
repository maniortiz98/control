export interface SaveCheckpointResponse {
    applicationNumber: any;
    sectionId: string;
    status: string;
    data?: ContractData;
};

export interface SaveCheckpointMantResponse {
    applicationNumber: any;
    sectionId: string;
    status: string;
};

export interface ContractData {
    contracts: Contract[];
};

export interface Contract {
    titular: string;
    number: string;
    rfc: string;
    type: string;
    subType: string;
    date: string;
};