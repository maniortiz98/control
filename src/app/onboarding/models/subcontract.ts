export interface SubContract {
    contractTypeId: number;
    contractSubtypeId: number;
    contractSubtype: string;
    ranking: number;
}

export interface SubContractRequest {
    contractTypeId: number;
    personTypeId: number;
}
