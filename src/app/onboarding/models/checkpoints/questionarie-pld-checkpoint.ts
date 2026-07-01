import { Moment } from "moment";

export interface PldQuestionarieDataCheckpoint {
  naturalPerson:            NaturalPerson;
  incomeSource:             IncomeSource;
  ppe:                      Ppe;
  realOwner:                RealOwner;
  transactionProfileUpdate: TransactionProfileUpdate;
  actinverInternalUse:      ActinverInternalUse;
}

export interface ActinverInternalUse {
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

export interface IncomeSource {
  currentEmployment     : CurrentEmployment;
  ownBusiness           : OwnBusiness;
  shareholderOrAssociate: ShareholderOrAssociate;
}

export interface CurrentEmployment {
  employerName                         : string;
  businessActivity                     : string;
  address                              : string;
  phone                                : number;
  position                             : string;
  seniorityMonths                      : number;
  previousEmployment                   : PreviousEmployment;
  monthlyIncome                        : number;
  otherIncome                          : string | number;
  hasFinancialResourceDisposalPowers   : boolean;
  specify                              : string;
  employerIsNonProfitOrGovOrListed     : boolean;
  specifyWhich                         : string;
  employerIsNonGAFIFinancialInstitution: boolean;
  specifyPattern                       : string;
}

export interface PreviousEmployment {
  employerName:     string;
  businessActivity: string;
  address:          string;
  phone:            number;
  position:         string;
  seniorityMonths:  number;
  monthlyIncome:    number;
}

export interface OwnBusiness {
  businessActivity                      : string;
  curp                                  : string;
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
  specifyWhich                          : string;
  indicate                              : string;
  specifyWhichResources                 : string;
}

export interface ShareholderOrAssociate {
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

export interface NaturalPerson {
  professionActivity:              boolean;
  indicateActivity:                string;
  roleType:                        RoleType;
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

export interface RoleType {
  managerOfficerEmployee:     boolean;
  independentProfessional:    boolean;
  individualBusinessActivity: boolean;
}

export interface Ppe {
  isPpe:                             boolean;
  positionAndInstitution:            string;
  isPartnerAssociateOrRelativeOfPpe: boolean;
  relatedPpePersons:                 RelatedPpePerson;
}

export interface RelatedPpePerson {
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
  numIdFiscal     : string | null;
}

export interface RealOwner {
  reasonToOpenWithThoseFunds  : string;
  relationshipWithClient      : string;
  reasonToProvideFundsToClient: string;
  oneTimeContribution         : boolean;
  approximateAmount           : number;
  contributionPeriodic        : boolean;
  indicateApproximateAmount   : string;
  indicatePeriodicity         : string;
  approximateAmountPeriodic?  : string | number;
  periodicity?                : string;
}

export interface TransactionProfileUpdate {
  intendedUseOfAccount:           string;
  approxMonthlyIncomingResources: number;
  monthlyOperations:              MonthlyOperation;
}

export interface MonthlyOperation {
  operationType: OperationType;
}

export interface OperationType {
  acctUsageIntentDescription  : string;
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

export interface PldQuizFormData {
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

