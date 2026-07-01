import { CustomerSubContract } from "./customer-subcontract";

export enum CustomerBankingAreaTypeEnum {
    BANCO = 999,
    BOLSA = 998
}
export interface CustomerContract {
    bankAreaTypeId: number;
    contractTypeId: number;
    contractType: string;
}

export interface CustomerContractTop extends CustomerContract {
    typeContractSubtypeId: number;
    contractSubtype: string;
    ranking: number;
}

export interface CustomerContractTopRequest {
    limit: number;
    personTypeId: number;
}

export interface CustomerContractRequest {
    personTypeId: number;
}

export interface CustomerContractsLocal {
  pf: CustomerContractOnLocalStorage[];
  pm: CustomerContractOnLocalStorage[];
};

export interface CustomerContractOnLocalStorage extends CustomerContract {
    subcontract: CustomerSubContract[];
}

export type Contract = CustomerContract;
export type ContractTop = CustomerContractTop;
export type ContractTopRequest = CustomerContractTopRequest;
export type ContractRequest = CustomerContractRequest;
export type ContractsLocal = CustomerContractsLocal;
export type ContractOnLocalStorage = CustomerContractOnLocalStorage;

