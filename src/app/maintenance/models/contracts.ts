export interface ContractsSearchResponse {
    client: ClientPFCustomer | ClientPMCustomer;
    contracts: Contract[];
}

export interface ClientPFCustomer {
    birthDate             : string;
    clientId              : number;
    countryOfBirth        : string;
    curp                  : string;
    customerIdNumber      : number;
    fiscalResidenceCountry: string;
    flexClientId          : string;
    fullName              : string;
    gender                : string;
    nationality           : string;
    personId              : number;
    personType            : string;
    rfc                   : string;
}

export interface ClientPMCustomer {
    birthCountry       : string;
    birthDate          : string;
    clientFlexId       : number;
    clientId           : number;
    clientNumber       : number;
    curp               : string;
    firstLastName      : string;
    firstName          : string;
    gender             : string;
    nationality        : string;
    personId           : number;
    personType         : string;
    rfc                : string;
    secondLastName     : string;
    secondName         : string;
    taxResidenceCountry: string;

    // countryOfBirth, customerIdNumber, fiscalResidenceCountry, flexClientId
}

export interface Contract {
    accountId           : number;
    accountNumber       : number;
    accountStatus       : string;
    accountStatusId     : string;
    advisorEmail        : string;
    advisorId           : string;
    advisorName         : string;
    bankingArea         : string;
    clabeAccount        : number;
    clientId            : number;
    commissionPercentage: number;
    contractDenomination: string;
    contractSubtype     : string;
    contractSubtypeId   : number;
    contractType        : string;
    contractTypeId      : number;
    financialCenter     : string;
    financialCenterId   : string;
    flexAccount         : number;
    initialRisk         : number;
    modRisk             : number | null;
    openingDate         : string;
    operationsReason    : string;
}