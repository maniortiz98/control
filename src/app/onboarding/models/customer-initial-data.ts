import { FullNameClient } from "./client-data";

export interface CustomerInitialData extends SearchCustomerFound, NewContract { }

export interface SearchCustomerFound extends FullNameClient {
    customerNumber: string|undefined;
    curp: string|undefined;
    typeId: string|undefined;
    numId: string|undefined;
    birthdate: string|undefined;
    idProspect: string|undefined;
    applicationDate: string|undefined;
}

export interface NewContract {
    personType?: '1' | '2';         // Persona Fisica / Persona Moral
    bankAreaTypeId?: number;        // Tipo de Negocio => Casa de Bolsa / Banco
    contractTypeId?: number;        // Contrato ID
    contractType?: string;          // Contrato Name
    typeContractSubtypeId?: number; // Sub Contrato
    typeContractSubtype?: string;   // Sub Contrato Name
}
