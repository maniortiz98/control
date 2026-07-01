export interface CustomerSubContract {
    contractTypeId: number;
    contractSubtypeId: number;
    contractSubtype: string;
    ranking: number;
}

export interface CustomerSubContractRequest {
    contractTypeId: number;
    personTypeId: number;
}

export type SubContract = CustomerSubContract;
export type SubContractRequest = CustomerSubContractRequest;

