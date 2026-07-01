import { CustomerFullNameClient } from './customer-client-data';

export interface CustomerInitialData extends CustomerSearchCustomerFound, CustomerNewContract { }

export interface CustomerSearchCustomerFound extends CustomerFullNameClient {
    customerNumber: string|undefined;
    curp: string|undefined;
    typeId: string|undefined;
    numId: string|undefined;
    birthdate: string|undefined;
    idProspect: string|undefined;
    applicationDate: string|undefined;
}

export interface CustomerNewContract {
    personType?: '1' | '2';         // Persona Fisica / Persona Moral
    bankAreaTypeId?: number;        // Tipo de Negocio => Casa de Bolsa / Banco
    contractTypeId?: number;        // Contrato id
    contractType?: string;          // Contrato Name
    typeContractSubtypeId?: number; // Sub Contrato
    typeContractSubtype?: string;   // Sub Contrato Name
}


export type InitialData = CustomerInitialData;
export type SearchCustomerFound = CustomerSearchCustomerFound;
export type NewContract = CustomerNewContract;


