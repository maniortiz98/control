import { SubContract } from "./subcontract";

export enum BankingAreaTypeEnum {
    BANCO = '999',
    BOLSA = '998'
}
export interface Contract {
    bankAreaTypeId: number;
    contractTypeId: number;
    contractType: string;
}

export interface ContractTop extends Contract {
    typeContractSubtypeId: number;
    contractSubtype: string;
    ranking: number;
}

export interface ContractTopRequest {
    limit: number;
    personTypeId: number;
}

export interface ContractRequest {
    personTypeId: number;
}

export interface ContractsLocal {
  pf: ContractOnLocalStorage[];
  pm: ContractOnLocalStorage[];
};

export interface ContractOnLocalStorage extends Contract {
    subcontract: SubContract[];
}
