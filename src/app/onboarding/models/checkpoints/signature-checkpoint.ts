export interface SignatureDataCheckpointBase {
  signatureType: string;
  instructions:  string;
  ipabOwnership: string;
  isrRetention:  string;
}

export interface SignatureDataCheckpoint extends SignatureDataCheckpointBase{
  coHolders:     CoHolder[];
  legalProxy:    LegalProxy[];
}

export interface CoHolder extends CoHolderBase {
  identification:             Identification[];
  contactData:                ContactData;
}

export interface CoHolderBaseMant {
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
  occupation?:                string;
  companyName:                string;
  positionHeld:               string;
  phoneBussiness:             string;
  fiscalCountry:              string;
  fiscalIdentificationNumber: string;
  signatureType:              string;
  IPABCoverage:               string;
  incomeTaxWithholding:       string;
  personPpe:                  PersonPpe;
  residentialAddress:         CoHolderResidentialAddress;
  fiscalSelfDeclaration:      FiscalSelfDeclarationMant;
}

export interface CoHolderBase {
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
  occupation?:                string;
  companyName:                string;
  positionHeld:               string;
  phoneBussiness:             string;
  fiscalCountry:              string;
  fiscalIdentificationNumber: string;
  signatureType:              string;
  IPABCoverage:               string;
  incomeTaxWithholding:       string;
  personPpe:                  PersonPpe;
  residentialAddress:         CoHolderResidentialAddress;
  fiscalSelfDeclaration:      FiscalSelfDeclaration;
}

export interface ContactData {
  DataNonDisclosureLetter: boolean;
  registeredPhones:        RegisteredPhone[];
  registeredEmails:        RegisteredEmail[];
}

export interface RegisteredEmail {
  emailAddress:      string;
  notificationEmail: boolean;
}

export interface RegisteredPhone {
  type: number;
  country: string;
  areaCode: string;
  phone: string;
  extension: string;
  notificationPhone: boolean
}

export interface FiscalSelfDeclarationMant {
  id?:                  number | null;
  residesInMexico:      boolean;
  satRegisteredName:    string;
  fiscalRegime:         string;
  rfc?:                  string;
  useCFDI:              string;
  taxPostalCode:        string;
  expirationStatus:     string;
  facta:                boolean;
  foreignTaxResident:   boolean;
  taxAddress:           TaxAddressElement[];
}

export interface FiscalSelfDeclaration {
  id?:                  number | null;
  residesInMexico:      boolean;
  SATRegisteredName:    string;
  fiscalRegime:         string;
  useCFDI:              string;
  taxPostalCode:        string;
  expirationStatus:     string;
  facta:                boolean;
  foreignTaxResident:   boolean;
  taxAddress:           TaxAddressElement[];
}

export interface TaxAddressElement {
  taxAddress:       TaxAddressTaxAddress;
  fatcaCompliance:  FatcaCompliance;
  taxAddressActive: boolean;
  active?:           boolean;
}

export interface FatcaCompliance {
  id?:           number;
  autentication: string;
  nif:           string;
  tin:           string;
  nss:           string;
}

export interface TaxAddressTaxAddress {
  id?:                 number;
  personType:          string;
  fiscalResidence:     string;
  selfCertification:   boolean;
  proofOfTaxResidency: string;
  certificationDate:   string;
  declarationYear:     number;
  issueDate:           string;
  expirationStatus:    string;
  expirationDate:      string;
  aditionalDays:       string;
}

export interface Identification {
  countryOfIdentification: string;
  identificationType:      string;
  identificationNumber:    string;
  expirationDate:          string;
}

export interface PersonPpe {
  id?:             number;
  isPpe:           boolean;
  ppeType:         string;
  positionHeld:    string;
  positionEndDate: string;
  hasppeRelatives: boolean;
  ppeRelatives:    PpeRelative[];
}

export interface PpeRelative {
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

export interface CoHolderResidentialAddress {
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

export interface LegalProxyBase {
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
  personPpe:                  PersonPpe;
  residentialAddress:         LegalProxyResidentialAddress;
  faculties:                  Faculties;
}

export interface LegalProxy extends LegalProxyBase{
  identification:             Identification[];
  contactData:                ContactData;
}


export interface Faculties {
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

export interface LegalProxyResidentialAddress {
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
