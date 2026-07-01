import { Moment } from "moment";

export interface CustomerPldQuestionarieDataCheckpoint {
  naturalPerson:            CustomerNaturalPerson;
  incomeSource:             CustomerIncomeSource;
  ppe:                      CustomerPpe;
  realOwner:                CustomerRealOwner;
  transactionProfileUpdate: CustomerTransactionProfileUpdate;
  actinverInternalUse:      CustomerActinverInternalUse;
}

export interface CustomerActinverInternalUse {
  hasReferences:                    boolean;
  specify:                          string;
  operationsAmountCongruent:        boolean;
  operationsAmountCongruentSpecify: string;
  incomeSourceHighRisk:             boolean;
  incomeSourceHighRiskSpecify:      string;
  delegateDisposition:              string;
  visitDate:                        string;
  advisorName:                      string;
  advisorPosition:                  string;
  financialCenterManager:           string;
  financialCenterDirector           : string;
}

export interface CustomerIncomeSource {
  currentEmployment     : CustomerCurrentEmployment[];
  ownBusiness           : CustomerOwnBusiness[];
  shareholderOrAssociate: CustomerShareholderOrAssociate[];
}

export interface CustomerCurrentEmployment {
  employerName                         : string;
  businessActivity                     : string;
  address                              : string;
  phone                                : number;
  position                             : string;
  seniorityMonths                      : number;
  previousEmployment                   : CustomerPreviousEmployment;
  monthlyIncome                        : number;
  otherIncome                          : string | number;
  hasFinancialResourceDisposalPowers   : boolean;
  specify                              : string;
  employerIsNonProfitOrGovOrListed     : boolean;
  specifyWhich                         : string;
  employerIsNonGAFIFinancialInstitution: boolean;
  specifyPattern                       : string;
}

export interface CustomerPreviousEmployment {
  employerName:     string;
  businessActivity: string;
  address:          string;
  phone:            number;
  position:         string;
  seniorityMonths:  number;
  monthlyIncome:    number;
}

export interface CustomerOwnBusiness {
  businessActivity                      : string;
  curp?                                 : string;
  rfc                                   : string;
  nif                                   : string;
  tin                                   : string;
  nss                                   : string;
  businessName                          : string;
  address                               : string;
  phone                                 : number;
  fax                                   : string;
  website                               : string;
  roleInBusiness                        : string;
  operatingTimeMonths                   : number;
  employeesNumber                       : number;
  annualApproxIncome                    : number;
  mainGeographicZones                   : string;
  businessAddressNonGAFICountry         : boolean;
  hasContractsWithActinverGroup         : boolean;
  indicateWhich                         : string;
  isFinancialInstitutionInNonGafiCountry: boolean;
  manageDisposeFinancialResources       : boolean;
  specifyWhich?                         : string;
  indicate?                             : string;
  specifyWhichResources?                : string;
}

export interface CustomerShareholderOrAssociate {
  isMercantileCompanyPartner:             boolean;
  isCivilAssociationPartner:              boolean;
  specifyCompany:                         string;
  businessName:                           string;
  corporatePurpose:                       string;
  constitutionCountry:                    string;
  address:                                string;
  phone:                                  number;
  fax:                                    string;
  website:                                string;
  roleInCompany:                          string;
  timeAsPartnerMonths:                    number;
  coryzaStockExchange                     : boolean;
  positionCompany                         : string;
  timePartnerAssociate                    : string;
  participationPercentage:                string;
  annualApproxIncome:                     number;
  mainGeographicZones:                    string;
  hasNonGafiAddressOrZones:               boolean;
  which                                   : string;
  actinverContracts:                      boolean;
  indicateContractNumber                  : string;
  nonGafiOrTaxHavenFinInst:               boolean;
  otherIncomeSources:                     boolean;
  specifyOtherIncomeSources               : string;
  governmentOrPublicEntityRelations:      boolean;
  specifyGovernmentRelations              : string;
}

export interface CustomerNaturalPerson {
  professionActivity:              boolean;
  indicateActivity:                string;
  roleType:                        CustomerRoleType;
  toWhomInformationProvided:       string;
  productServiceContracted:        string;
  maximumDegreeStudies:            string;
  everActinverClient:              boolean;
  actinverContractNumber:          string;
  hasRelationOtherFinancialEntity: boolean;
  whichFinancialEntity:            string;
  nonGafiOrTaxHavenResident:       boolean;
  whichCountryIfNonGafi:           string;
  place:                           string;
  questionnaireApplicationDate:    string;
  fax:                             string;
  onlyCellphoneReason:             string;
}

export interface CustomerRoleType {
  managerOfficerEmployee:     boolean;
  independentProfessional:    boolean;
  individualBusinessActivity: boolean;
}

export interface CustomerPpe {
  isPpe:                             boolean;
  positionAndInstitution:            string;
  isPartnerAssociateOrRelativeOfPpe: boolean;
  relatedPpePersons:                 CustomerRelatedPpePerson[];
}

export interface CustomerRelatedPpePerson {
  curp:            string;
  noCurpForeigner: boolean;
  rfc:             string;
  nif:             string;
  tin:             string;
  nss:             string;
  birthDate:       string;
  firstName:       string;
  middleName:      string;
  lastName:        string;
  secondLastName:  string;
  relationship:    string;
  positionHeld:    string;
  numIdFiscal?     : string | null;
}

export interface CustomerRealOwner {
  reasonToOpenWithThoseFunds  : string;
  relationshipWithClient      : string;
  reasonToProvideFundsToClient: string;
  oneTimeContribution         : boolean;
  approximateAmount           : number;
  contributionPeriodic        : boolean;
  indicateApproximateAmount?  : string;
  indicatePeriodicity?        : string;
  approximateAmountPeriodic?  : string | number;
  periodicity?                : string;
}

export interface CustomerTransactionProfileUpdate {
  intendedUseOfAccount:           string;
  approxMonthlyIncomingResources: number;
  monthlyOperations:              CustomerMonthlyOperation[];
}

export interface CustomerMonthlyOperation {
  operationType: CustomerOperationType;
}

export interface CustomerOperationType {
  acctUsageIntentDescription? : string;
  numberDeposits:             string;
  numberOfWithdrawals:        string;
  numNatTransfersIn:          string;
  numNatTransfersOut:         string;
  numIntTransfersIn:          string;
  numIntTransfersOut:         string;
  other:                      string;
  countriesForTransfers:      string;
  nonFatfOrTaxHavenCountries: string;
  intlTransferReasons:        string;
  acctUsageIntent:            boolean;
  acctUsageOther:             boolean;
  specify:                    string;
}

export interface CustomerPldQuizFormData {
  // naturalPerson section
  professionActivity: boolean;
  activity: string;
  role: string;
  providedInfo: string;
  product: string;
  studiesDegree: string;
  isActinverEntity: boolean;
  actinverEntity: string;
  isFinancialEntity: boolean;
  financialEntity: string;
  isGafi: boolean;
  gafi: string;
  place: string;
  quizDate: string | Moment;
  fax: string;
  onlyPhoneReason: string | number;
  employee: boolean;
  independent: boolean;

  // incomeSource section
  jobName: string;
  jobActivity: string;
  jobAddress: string;
  jobPhone: string | number;
  jobRole: string;
  jobMonths: number;
  jobSalary: number;
  extraSalary: string | number;
  hasFinancialCompanyDisposition: boolean;
  financialCompanyDisposition: string;
  isGovernmentCompany: boolean;
  governmentCompany: string;
  isGafiCompany: boolean;
  gafiCompany: string;
  previousJobName: string;
  previousJobActivity: string;
  previousJobAddress: string;
  previousJobPhone: string | number;
  previousJobRole: string;
  previousJobMonths: number;
  previousJobSalary: number;

  // ownBusiness section
  businessActivity               : string;
  businessCurp                   : string;
  businessTypeId                 : string;
  businessId                     : string;
  businessName                   : string;
  businessAddress                : string;
  businessPhone                  : string | number;
  businessFax                    : string;
  businessWebPage                : string;
  businessRole                   : string;
  businessTime                   : number;
  businessEmployees              : number;
  businessAnnualSalary           : number;
  businessGeographyZones         : string;
  hasFinancialBusinessDisposition: boolean;
  financialBusinessDisposition   : string;
  isBusinessGafiZones            : boolean;
  businessGafiZones              : string;
  isBusinessActinver             : boolean;
  businessActinver               : string;
  isBusinessGafi                 : boolean;
  businessGafi                   : string;

  // shareholderOrAssociate section
  isMarketSociety: boolean;
  isSocietyOrAssociation: boolean;
  societyOrAssociation: string;
  companyName: string;
  corporatePurpose: string;
  constitutionCountry: string;
  societyAddress: string;
  societyPhone: string | number;
  societyFax: string;
  societyWebPage: string;
  societyRole: string;
  societyTime: number;
  stockList: boolean;
  ownSocietyRole: string;
  ownSocietyTime: string;
  ownSocietyPercentage: string;
  societyAnnualSalary: number;
  societyGeographyZones: string;
  isGafiGeographyZonesSociety: boolean;
  gafiGeographyZonesSociety: string;
  isActinverSociety: boolean;
  actinverSociety: string;
  isGafiSociety: boolean;
  hasSocietyExtraSalary: boolean;
  societyExtraSalary: string;
  isGovernmentSociety: boolean;
  governmentSociety: string;

  // ppe section
  isPoliticalExposedPerson: boolean;
  politicalExposedPerson: string;
  isRelativePoliticalExposedPerson: boolean;

  // relatedPpePersons section
  relativePpeCurp: string;
  relativeTypeId: string;
  relativePpeId: string;
  ppeBirthDate: string | Moment;
  relativePpeFirstName: string;
  relativePpeSecondName: string;
  relativePpeFirstLastName: string;
  relativePpeSecondLastName: string;
  relativePpe: string;
  foreignerWithoutCurp: boolean;

  // realOwner section
  accountReason: string;
  clientRelationship: string;
  clientResourcesReason: string;
  isOnlyOnePayment: boolean;
  onlyOnePayment: number;
  isCurrentPayment: boolean;
  currentPayment: string;
  currentPaymentFrequency: string;

  // transactionProfileUpdate section
  accountPurpose: string;
  monthPayment: number;
  inputsNumber: string;
  outputsNumber: string;
  nationalInputsNumber: string;
  nationalOutputsNumber: string;
  internationalInputsNumber: string;
  internationalOutputsNumber: string;
  otherMovements: string;
  countriesMovements: string;
  gafiCountriesMovements: string;
  countriesMovementsReason: string;
  isForMovementsAccount: boolean;
  isForOthersMovementsAccount: boolean;
  forOthersMovementsAccount: string;
  forMovementsAccount: string;

  // actinverInternalUse section
  hasClientReference: boolean;
  clientReference: string;
  isMovementSimilar: boolean;
  movementSimilar: string;
  isActinverHighRisk: boolean;
  actinverHighRisk: string;
  clientDisposition: string;
  clientVisitDate: string | Moment;
  adviserName: string;
  adviserRole: string;
  financialManager: string;
  financialDirector: string;
}


export type PldQuestionarieDataCheckpoint = CustomerPldQuestionarieDataCheckpoint;
export type ActinverInternalUse = CustomerActinverInternalUse;
export type IncomeSource = CustomerIncomeSource;
export type CurrentEmployment = CustomerCurrentEmployment;
export type PreviousEmployment = CustomerPreviousEmployment;
export type OwnBusiness = CustomerOwnBusiness;
export type ShareholderOrAssociate = CustomerShareholderOrAssociate;
export type NaturalPerson = CustomerNaturalPerson;
export type RoleType = CustomerRoleType;
export type Ppe = CustomerPpe;
export type RelatedPpePerson = CustomerRelatedPpePerson;
export type RealOwner = CustomerRealOwner;
export type TransactionProfileUpdate = CustomerTransactionProfileUpdate;
export type MonthlyOperation = CustomerMonthlyOperation;
export type OperationType = CustomerOperationType;
export type PldQuizFormData = CustomerPldQuizFormData;

