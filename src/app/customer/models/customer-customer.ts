export type CustomerSections = 'initialData'
    | 'generalInformation'
    | 'identifications'
    | 'telephones'
    | 'emails'
    | 'addresses'
    | 'fiscalSelfDeclaration'
    | 'factaObligation'
    | 'ppeInformation'
    | 'familyData'
    ;

export interface CustomerInfo extends CustomerInformationError{
    initialData?           : CustomerCI_InitialData;
    generalInformation?    : CustomerCI_GeneralInformation;
    identificationContact?: CustomerCI_IdentificationContact;
    addresses?            : CustomerCI_Address[];
    fiscalResidences?     : any[]; // TODO falta agregar este modelo.
    fiscalSelfDeclaration?     : CustomerCI_FiscalSelfDeclaration[]; // TODO falta agregar este modelo. no hay datos ni contrato a hoy.
    factaObligation?      : CustomerCI_FactaObligation;
    ppeInformation?       : CustomerCI_PpeInformation;
}

export interface CustomerInformation {
    initialData?       : CustomerCI_InitialData;
    generalInformation?: CustomerCI_GeneralInformation;
    identifications?   : any;
    telephones?        : CustomerCI_Telephone[];
    emails?            : CustomerCI_Email[];
    addresses?         : CustomerCI_Address[];
    fiscalResidences?     : any[]; // TODO falta agregar este modelo.
    fiscalSelfDeclaration?  : CustomerCI_FiscalSelfDeclaration[];
    factaObligation?   : CustomerCI_FactaObligation;
    ppeInformation?    : CustomerCI_PpeInformation;
}

export interface CustomerCI_InitialData {
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

export interface CustomerCI_GeneralInformation {
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
    address             : CustomerAddressGI | null;
};

export interface CustomerCI_IdentificationContact {
    identifications: any[];
    telephones     : CustomerCI_Telephone[];
    emails         : CustomerCI_Email[];
}

export interface CustomerCI_Telephone {
    id               : number | null;
    type             : string | null;
    country          : string | null;
    areaCode         : string | null;
    phone            : string | null;
    extension        : string | null;
    notificationPhone: boolean;
    active           : boolean;
}

export interface CustomerCI_Email {
    id               : number | null;
    type             : string | null;
    emailAddress     : string | null;
    notificationEmail: boolean;
    active           : boolean;
}

export interface CustomerCI_Address {
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

export interface CustomerCI_FiscalSelfDeclaration {
  id?: number | null;
  mexicoResident: boolean;
  curp: string | null;
  foreignerWithoutCurp: boolean;
  rfc: string | null;
  name: string | null;
  fiscalRegimeId: number | null;
  cfdiUse: string | null;
  taxPostalCode: string | null;
  nationality: string | null;
  country: string | null;
  fiscalResidenceAbroad: boolean;
  facta: boolean;
  crs: boolean;
  fiscalResidences: CustomerCI_FiscalResidence[];
}

export interface CustomerCI_FiscalResidence {
  personId: number | null;
  active: boolean;
  personType: number | null;
  country: string | null;
  declarationFiscalResidence: boolean;
  proofOfAddressType: string | null;
  issueDate: string | null;
  expirationStatus: string | null;
  expirationDate: string | null;
  certificationDate: string | null;
  declarationYear: number | null;
  aditionalDays: string | null;
  factaObligations: CustomerCI_FactaObligation;
  activeFiscalDomicilie?: boolean;
}

export interface CustomerCI_FactaObligation {
    factaId       : number | null;
    authentication: string | null;
    nif           : string | null;
    tin           : string | null;
    nss           : string | null;
}

export interface CustomerCI_PpeInformation {
    id            : number | null;
    ppeType       : string | null;
    positionHeld  : string | null;
    expirationDate: string | null;
    hasFamilyPpe  : boolean;
    familyData    : CustomerCI_FamilyData[] | null;
    ppe           : boolean;
}


export interface CustomerCI_FamilyData {
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

export interface CustomerAddressGI {
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












export type Sections = CustomerSections;
export type Info = CustomerInfo;
export type Information = CustomerInformation;
export type CI_InitialData = CustomerCI_InitialData;
export type CI_GeneralInformation = CustomerCI_GeneralInformation;
export type CI_IdentificationContact = CustomerCI_IdentificationContact;
export type CI_Telephone = CustomerCI_Telephone;
export type CI_Email = CustomerCI_Email;
export type CI_Address = CustomerCI_Address;
export type CI_FactaObligation = CustomerCI_FactaObligation;
export type CI_PpeInformation = CustomerCI_PpeInformation;
export type CI_FamilyData = CustomerCI_FamilyData;
export type AddressGI = CustomerAddressGI;
export type InformationError = CustomerInformationError;

