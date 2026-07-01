export interface CustomerSignatureDataCheckpointBase {
  signatureType: string;
  instructions:  string;
  ipabOwnership: string;
  isrRetention:  string;
}

export interface CustomerSignatureDataCheckpoint extends CustomerSignatureDataCheckpointBase{
  coHolders:     CustomerCoHolder[];
  legalProxy:    CustomerLegalProxy[];
}

export interface CustomerCoHolder extends CustomerCoHolderBase {
  identification:             CustomerIdentification[];
  contactData:                CustomerContactData;
}

export interface CustomerCoHolderBase {
  curp:                       string;
  foreignerWithoutCurp:       boolean;
  rfc:                        string;
  nif:                        string;
  tin:                        string;
  nss:                        string;
  firstName:                  string;
  middleName:                 string;
  firstLastName:              string;
  secondLastName:             string;
  dateOfBirth:                string;
  gender:                     number;
  maritalStatus:              number;
  nacionality:                string;
  countryOfBirth:             string;
  federalEntity:              string;
  relationship:               number | null;
  economicActivity:           string;
  companyName:                string;
  positionHeld:               string;
  phoneBussiness:             string;
  fiscalCountry:              string;
  fiscalIdentificationNumber: string;
  signatureType:              string;
  IPABCoverage:               string;
  incomeTaxWithholding:       string;
  personPpe:                  CustomerPersonPpe;
  residentialAddress:         CustomerCoHolderResidentialAddress;
  fiscalSelfDeclaration:      CustomerFiscalSelfDeclaration;
}

export interface CustomerContactData {
  DataNonDisclosureLetter: boolean;
  registeredPhones:        CustomerRegisteredPhone[];
  registeredEmails:        CustomerRegisteredEmail[];
}

export interface CustomerRegisteredEmail {
  emailAddress:      string;
  notificationEmail: boolean;
}

export interface CustomerRegisteredPhone {
  type: number;
  country: string;
  areaCode: string;
  phone: string;
  extension: string;
  notificationPhone: boolean
}

export interface CustomerFiscalSelfDeclaration {
  id?:                  number;
  residesInMexico:      boolean;
  SATRegisteredName:    string;
  fiscalRegime:         string;
  useCFDI:              string;
  taxPostalCode:        string;
  expirationStatus:     string;
  isForeignTaxResident: boolean;
  taxAddress:           CustomerTaxAddressElement[];
}

export interface CustomerTaxAddressElement {
  taxAddress:       CustomerTaxAddressTaxAddress;
  fatcaCompliance:  CustomerFatcaCompliance;
  taxAddressActive: boolean;
  active?:           boolean;
}

export interface CustomerFatcaCompliance {
  id?:           number;
  autentication: string;
  nif:           string;
  tin:           string;
  nss:           string;
}

export interface CustomerTaxAddressTaxAddress {
  id?:                  number;
  personType:          string;
  fiscalResidence:     string;
  selfCertification:   boolean;
  proofOfTaxResidency: string;
  certificationDate:   string;
  declarationYear:     number;
}

export interface CustomerIdentification {
  countryOfIdentification: string;
  identificationType:      string;
  identificationNumber:    string;
  expirationDate:          string;
}

export interface CustomerPersonPpe {
  id?:             number;
  isPpe:           boolean;
  ppeType:         string;
  positionHeld:    string;
  positionEndDate: string;
  hasppeRelatives: boolean;
  ppeRelatives:    CustomerPpeRelative[];
}

export interface CustomerPpeRelative {
  id?:                    number;
  accountRoleId?:         number;
  active?:                boolean;
  curp:                  string;
  foreignerWithoutCurp:  boolean;
  rfc:                   string;
  nif:                   string;
  tin:                   string;
  nss:                   string;
  firstName:             string;
  middleName:            string;
  firstLastName:         string;
  secondLastName:        string;
  dateOfBirth:           string;
  maritalStatus?:        string;
  nationality:           string;
  countryOfBirth?:       string;
  federalEntity?:        string;
  relationship:          number | null;
  positionHeld:          string;
  positionEndDate:       string;
}

export interface CustomerCoHolderResidentialAddress {
  id?:              number;
  addressRol:       string;
  addressType:      string;
  other:            string;
  country:          string;
  street:           string;
  externalNumber:   string;
  internalNumber:   string;
  postalCode:       string;
  federalEntity:    string;
  city:             string;
  municipality:     string;
  neighborhood:     string;
  geographicalArea: string;
  deliveryCenter:   string;
}

export interface CustomerLegalProxyBase {
  curp:                       string;
  foreignerWithoutCurp:       boolean;
  rfc:                        string;
  nif:                        string;
  tin:                        string;
  nss:                        string;
  firstName:                  string;
  middleName:                 string;
  firstLastName:              string;
  secondLastName:             string;
  dateOfBirth:                string;
  gender:                     number;
  maritalStatus:              number;
  nacionality:                string;
  countryOfBirth:             string;
  federalEntity:              string;
  relationship:               number | null;
  economicActivity:           number;
  occupation:                 string;
  profession:                 string;
  companyName:                string;
  positionHeld:               string;
  phoneBussiness:             string;
  fiscalCountry:              string;
  fiscalIdentificationNumber: string;
  signatureType:              string;
  IPABCoverage?:               string;
  incomeTaxWithholding?:       string;
  personPpe:                  CustomerPersonPpe;
  residentialAddress:         CustomerLegalProxyResidentialAddress;
  faculties:                  CustomerFaculties;
}

export interface CustomerLegalProxy extends CustomerLegalProxyBase{
  identification:             CustomerIdentification[];
  contactData:                CustomerContactData;
}


export interface CustomerFaculties {
  id?:                    number;
  faculties:              boolean;
  domain:                 boolean;
  delegationPower:        boolean;
  creditInstruments:      boolean;
  powerToOpenAccounts:    boolean;
  numberPropertyDeeds:    string;
  datePropertyDeeds:      string;
  notaryName:             string;
  notarynumber:           number;
  protocolizationBranch:  string;
  limitationsOnAuthority: string;
}

export interface CustomerLegalProxyResidentialAddress {
  id?:              number;
  addressRol:       string;
  addressType:      string;
  other:            string;
  country:          string;
  street:           string;
  externalNumber:   string;
  internalNumber:   string;
  postalCode:       string;
  federalEntity:    string;
  city:             string;
  municipality:     string;
  neighborhood:     string;
  geographicalArea: string;
  deliveryCenter:   string;
}



export type SignatureDataCheckpointBase = CustomerSignatureDataCheckpointBase;
export type SignatureDataCheckpoint = CustomerSignatureDataCheckpoint;
export type CoHolder = CustomerCoHolder;
export type CoHolderBase = CustomerCoHolderBase;
export type ContactData = CustomerContactData;
export type RegisteredEmail = CustomerRegisteredEmail;
export type RegisteredPhone = CustomerRegisteredPhone;
export type FiscalSelfDeclaration = CustomerFiscalSelfDeclaration;
export type TaxAddressElement = CustomerTaxAddressElement;
export type FatcaCompliance = CustomerFatcaCompliance;
export type TaxAddressTaxAddress = CustomerTaxAddressTaxAddress;
export type Identification = CustomerIdentification;
export type PersonPpe = CustomerPersonPpe;
export type PpeRelative = CustomerPpeRelative;
export type CoHolderResidentialAddress = CustomerCoHolderResidentialAddress;
export type LegalProxyBase = CustomerLegalProxyBase;
export type LegalProxy = CustomerLegalProxy;
export type Faculties = CustomerFaculties;
export type LegalProxyResidentialAddress = CustomerLegalProxyResidentialAddress;

