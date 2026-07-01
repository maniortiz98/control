export type CustomerSections = 'initialData'
    | 'generalInformation'
    | 'identifications'
    | 'telephones'
    | 'emails'
    | 'addresses'
    | 'fiscalResidences'
    | 'factaObligation'
    | 'ppeInformation'
    | 'familyData'
    ;

export interface CustomerInfo extends CustomerInformationError{
    initialData?           : CI_InitialData;
    generalInformation?    : CI_GeneralInformation;
    identificationContact?: CI_IdentificationContact;
    addresses?            : CI_Address[];
    fiscalResidences?     : any[]; // TODO falta agregar este modelo. no hay datos ni contrato a hoy.
    factaObligation?      : CI_FactaObligation;
    ppeInformation?       : CI_PpeInformation;
}

export interface CustomerInformation {
    initialData?       : CI_InitialData;
    generalInformation?: CI_GeneralInformation;
    identifications?   : any;
    telephones?        : CI_Telephone[];
    emails?            : CI_Email[];
    addresses?         : CI_Address[];
    fiscalResidences?  : any[];
    factaObligation?   : CI_FactaObligation;
    ppeInformation?    : CI_PpeInformation;
}

export interface CI_InitialData {
    id                  : number;
    curp                : string | null;
    rfc                 : string | null;
    nif                 : string | null;
    tin                 : string | null;
    nss                 : string | null;
    firstName           : string | null;
    middleName          : string | null;
    firstLastName       : string | null;
    secondLastName      : string | null;
    dateOfBirth         : string | null;
    gender              : string | null;
    nationality         : string | null;
    countryOfBirth      : string | null;
    stateOfBirth        : string | null;
    cityOfBirth         : string | null;
    ppe                 : boolean;
    foreignerWithoutCurp: boolean;
}

export interface CI_GeneralInformation {
    personType          : string | null;
    occupation          : string | null;
    maritalStatus       : string | null;
    marriageType        : string | null;
    actinverEmployee    : boolean;
    employeeNumber      : string | null;
    related             : boolean;
    relationship?       : string | null;
    institutionName     : string | null;
    workDataId          : number | null;
    profession          : string | null;
    companyName         : string | null;
    jobTitle            : string | null;
    companyPhone        : string | null;
    website             : string | null;
    personClassification: string | null;
    economicActivity    : string | null;
    sector              : string | null;
    fiel                : string | null;
    fielExpirationDate  : string | null;
    codigoSwiftBic      : string | null;
    mensajesMt940       : boolean;
    address             : AddressGI | null;
};

export interface CI_IdentificationContact {
    identifications: any[];
    telephones     : CI_Telephone[];
    emails         : CI_Email[];
}

export interface CI_Telephone {
    id               : number | null;
    type             : string | null;
    country          : string | null;
    areaCode         : string | null;
    phone            : string | null;
    extension        : string | null;
    notificationPhone: boolean;
    active           : boolean;
}

export interface CI_Email {
    id               : number | null;
    type             : string | null;
    emailAddress     : string | null;
    notificationEmail: boolean;
    active           : boolean;
}

export interface CI_Address {
    addressId                   : number | null;
    addressAccountId            : number | null;
    addressType                 : string | null;
    addressRole                 : string | null;
    country                     : string | null;
    postalCode                  : string | null;
    street                      : string | null;
    externalNumber              : string | null;
    internalNumber              : string | null;
    federalEntity               : string | null;
    municipality                : string | null;
    neighborhood                : string | null;
    city                        : string | null;
    geographicalArea            : string | null;
    deliveryCenter              : string | null;
    timeLiveMexico              : string | null;
    proofOfAddressType          : string | null;
    addressProofIssueDate       : string | null;
    expirationYear              : number | null;
    reasonsOpeningContractMexico: string | null;
    other                       : string | null;
    isAddressResidenceSameTax   : boolean;
    active                      : boolean;
}

export interface CI_FactaObligation {
    factaId       : number | null;
    authentication: string | null;
    nif           : string | null;
    tin           : string | null;
    nss           : string | null;
}

export interface CI_PpeInformation {
    id            : number | null;
    ppeType       : string | null;
    positionHeld  : string | null;
    expirationDate: string | null;
    hasFamilyPpe  : boolean;
    familyData    : CI_FamilyData[] | null;
    ppe           : boolean;
}


export interface CI_FamilyData {
    id                   : number | null;
    personId             : number | null;
    accountRole          : string | null;
    firstName            : string | null;
    middleName           : string | null;
    firstLastName        : string | null;
    secondLastName       : string | null;
    positionHeld         : string | null;
    positionHeldEndDate  : string | null;
    foreignerWithoutCurp : boolean;
    relationship         : string | null;
    nationality          : string | null;
    rfc                  : string | null;
    nif                  : string | null;
    tin                  : string | null;
    nss                  : string | null;
    curp                 : string | null;
    dateOfBirth          : string | null;
    maritalStatus        : string | null;
    countryOfBirth       : string | null;
    stateOfBirth         : string | null;
    cityOfBirth          : string | null;
}

export interface AddressGI {
  addressId:      number | null;
  addressType:    string | null;
  country:        string | null;
  postalCode:     string | null;
  street:         string | null;
  externalNumber: string | null;
  internalNumber: string | null;
  federalEntity:  string | null;
  municipality:   string | null;
  neighborhood:   string | null;
  city:           string | null;
  otherAddress?:  string | null;
}

export interface CustomerInformationError {
  status?: number;
  appCode?: string;
  message?: [string];
}
