import { FormGroup } from "@angular/forms";
import { OwnBusiness, PldQuestionarieDataCheckpoint, PldQuizFormData, RelatedPpePerson } from "../../models/checkpoints/questionarie-pld-checkpoint";
import { convertDate } from '../../../shared/utils/datetime';
import moment from 'moment';

/**
 * This Mapper is used for MAINTENANCE
 */
export function pldQuizToCheckpoint(formGroup: FormGroup): PldQuestionarieDataCheckpoint {
  const form = { value: formGroup.getRawValue() };
  return {
    naturalPerson: {
      professionActivity : form.value.professionActivity,
      indicateActivity   : form.value.activity ?? '',
      roleType: {
        managerOfficerEmployee        : form.value.role == 'managerOfficerEmployee',
        independentProfessional       : form.value.role == 'independentProfessional',
        individualBusinessActivity    : form.value.role == 'individualBusinessActivity',
      },
      toWhomInformationProvided      : form.value.providedInfo ?? '',
      productServiceContracted       : form.value.product ?? '',
      maximumDegreeStudies           : form.value.studiesDegree ?? '',
      everActinverClient             : form.value.isActinverEntity ?? false,
      actinverContractNumber         : form.value.actinverEntity ?? '',
      hasRelationOtherFinancialEntity: form.value.isFinancialEntity ?? false,
      whichFinancialEntity           : form.value.financialEntity ?? '',
      nonGafiOrTaxHavenResident      : form.value.isGafi ?? false,
      whichCountryIfNonGafi          : form.value.gafi ?? '',
      place                          : form.value.place ?? '',
      questionnaireApplicationDate   : convertDate(form.value.quizDate).toString() ?? '',
      fax                            : form.value.fax ?? '',
      onlyCellphoneReason            : form.value.onlyPhoneReason ?? '',
    },
    incomeSource: {
      currentEmployment: {
        employerName    : form.value.jobName ?? '',
        businessActivity: form.value.jobActivity ?? '',
        address         : form.value.jobAddress ?? '',
        phone           : form.value.jobPhone ?? '',
        position        : form.value.jobRole ?? '',
        seniorityMonths : form.value.jobMonths ?? null,
        monthlyIncome   : parseFloat(form.value.jobSalary) ?? null,
        previousEmployment: {
          employerName    : form.value.previousJobName ?? '' ,
          businessActivity: form.value.previousJobActivity ?? '' ,
          address         : form.value.previousJobAddress ?? '' ,
          phone           : form.value.previousJobPhone ?? '' ,
          position        : form.value.previousJobRole ?? '' ,
          seniorityMonths : form.value.previousJobMonths ?? null ,
          monthlyIncome   : Number(form.value.previousJobSalary) ?? null ,
        },
        otherIncome                          : Number(form.value.extraSalary) ?? '',
        hasFinancialResourceDisposalPowers   : form.value.hasFinancialCompanyDisposition ?? false,
        specify                              : form.value.financialCompanyDisposition ?? '',
        employerIsNonProfitOrGovOrListed     : form.value.isGovernmentCompany ?? false,
        specifyWhich                         : form.value.governmentCompany ?? '',
        employerIsNonGAFIFinancialInstitution: form.value.isGafiCompany ?? false,
        specifyPattern                       : form.value.gafiCompany ?? '',
      },
      ownBusiness: {
        businessActivity:                         form.value.businessActivity ?? '' ,
        curp                                      : form.value.businessCurp ?? '',
        rfc:                                      form.value.businessTypeId === "1" ? form.value.businessId ?? '' : '',
        nif:                                      form.value.businessTypeId === "2" ? form.value.businessId ?? '' : '',
        tin:                                      form.value.businessTypeId === "3" ? form.value.businessId ?? '' : '',
        nss:                                      form.value.businessTypeId === "4" ? form.value.businessId ?? '' : '',
        businessName:                             form.value.businessName ?? '' ,
        address:                                  form.value.businessAddress ?? '' ,
        phone:                                    form.value.businessPhone ?? '' ,
        fax:                                      form.value.businessFax ?? '' ,
        website:                                  form.value.businessWebPage ?? '' ,
        roleInBusiness:                           form.value.businessRole ?? '' ,
        operatingTimeMonths:                      Number(form.value.businessTime) ?? null ,
        employeesNumber:                          Number(form.value.businessEmployees) ?? null ,
        annualApproxIncome:                       parseFloat(form.value.businessAnnualSalary) ?? null ,
        mainGeographicZones:                      form.value.businessGeographyZones ?? '' ,
        businessAddressNonGAFICountry             : form.value.hasFinancialBusinessDisposition ?? false ,
        specifyWhich                              : form.value.financialBusinessDisposition ?? '',
        hasContractsWithActinverGroup             : form.value.isBusinessGafiZones ?? false ,
        indicateWhich                             : form.value.businessGafiZones ?? '',
        isFinancialInstitutionInNonGafiCountry    : form.value.isBusinessActinver ?? false ,
        indicate                                  : form.value.businessActinver ?? '',
        manageDisposeFinancialResources           : form.value.isBusinessGafi ?? false ,
        specifyWhichResources                     : form.value.businessGafi ?? '',
      },
      shareholderOrAssociate:{
        isMercantileCompanyPartner:               form.value.isMarketSociety ?? false,
        isCivilAssociationPartner:                form.value.isSocietyOrAssociation ?? false,
        specifyCompany:                           form.value.societyOrAssociation ?? '' ,
        businessName:                             form.value.companyName ?? '' ,
        corporatePurpose:                         form.value.corporatePurpose ?? '' ,
        constitutionCountry:                      form.value.constitutionCountry ?? '' ,
        address:                                  form.value.societyAddress ?? '' ,
        phone:                                    form.value.societyPhone ?? '' ,
        fax:                                      form.value.societyFax ?? '' ,
        website:                                  form.value.societyWebPage ?? '' ,
        roleInCompany:                            form.value.societyRole ?? '' ,
        timeAsPartnerMonths:                      Number(form.value.societyTime) ?? null ,
        coryzaStockExchange:                      form.value.stockList ?? false ,
        positionCompany:                          form.value.ownSocietyRole ?? '' ,
        timePartnerAssociate:                     form.value.ownSocietyTime ?? '' ,
        participationPercentage:                  form.value.ownSocietyPercentage ?? '' ,
        annualApproxIncome:                       parseFloat(form.value.societyAnnualSalary) ?? null ,
        mainGeographicZones:                      form.value.societyGeographyZones ?? '' ,
        hasNonGafiAddressOrZones:                 form.value.isGafiGeographyZonesSociety ?? false,
        which                                     : form.value.gafiGeographyZonesSociety ?? '',
        actinverContracts:                        form.value.isActinverSociety ?? false,
        indicateContractNumber:                   form.value.actinverSociety ?? '',
        nonGafiOrTaxHavenFinInst:                 form.value.isGafiSociety ?? false,
        otherIncomeSources:                       form.value.hasSocietyExtraSalary ?? false ,
        specifyOtherIncomeSources:                form.value.societyExtraSalary ?? '',
        governmentOrPublicEntityRelations:        form.value.isGovernmentSociety ?? false,
        specifyGovernmentRelations:               form.value.governmentSociety ?? '',
      }
    },
    ppe: {
      isPpe:                                      form.value.isPoliticalExposedPerson ?? false,
      positionAndInstitution:                     form.value.politicalExposedPerson ?? '',
      isPartnerAssociateOrRelativeOfPpe:          form.value.isRelativePoliticalExposedPerson ?? false,
      relatedPpePersons: {
        curp:                                     form.value.relativePpeCurp ?? '',
        noCurpForeigner:                          form.value.foreignerWithoutCurp ?? false,
        rfc:                                      form.value.relativeTypeId === "1" ? form.value.relativePpeId ?? '' : '',
        nif:                                      form.value.relativeTypeId === "2" ? form.value.relativePpeId ?? '' : '',
        tin:                                      form.value.relativeTypeId === "3" ? form.value.relativePpeId ?? '' : '',
        nss:                                      form.value.relativeTypeId === "4" ? form.value.relativePpeId ?? '' : '',
        birthDate:                                String(convertDate(form.value.ppeBirthDate)) ?? '',
        firstName:                                form.value.relativePpeFirstName ?? '',
        middleName:                               form.value.relativePpeSecondName ?? '',
        lastName:                                 form.value.relativePpeFirstLastName ?? '',
        secondLastName:                           form.value.relativePpeSecondLastName ?? '',
        relationship:                             form.value.relativePpe ?? '',

        positionHeld                            : '', // SIN MAPPEAR, NI BACK NI FRONT
        numIdFiscal                             : null, // SIN MAPPEAR, NI BACK NI FRONT
      }
    },
    realOwner: {
      reasonToOpenWithThoseFunds:                 form.value.accountReason ?? '',
      relationshipWithClient:                     form.value.clientRelationship ?? '',
      reasonToProvideFundsToClient:               form.value.clientResourcesReason ?? '',
      oneTimeContribution:                        form.value.isOnlyOnePayment ?? false,
      approximateAmount:                          parseFloat(form.value.onlyOnePayment) ?? null,
      contributionPeriodic:                       form.value.isCurrentPayment ?? false,
      indicateApproximateAmount:                  form.value.currentPayment ?? '',
      indicatePeriodicity:                        form.value.currentPaymentFrequency ?? '',
    },
    transactionProfileUpdate: {
      intendedUseOfAccount:                       form.value.accountPurpose ?? '',
      approxMonthlyIncomingResources:             parseFloat(form.value.monthPayment) ?? null,
      monthlyOperations: {
        operationType: {
          numberDeposits                          : String(form.value?.inputsNumber ?? ''),                //  Número de depósitos
          numberOfWithdrawals                     : String(form.value?.outputsNumber ?? ''),               //  Número de retiros
          numNatTransfersIn                       : String(form.value?.nationalInputsNumber ?? ''),        //  Número de transferencias nacionales que se recibirán
          numNatTransfersOut                      : String(form.value?.nationalOutputsNumber ?? ''),       //  Número de transferencias nacionales que se enviarán
          numIntTransfersIn                       : String(form.value?.internationalInputsNumber ?? ''),   //  Número de transferencias internacionales que se recibirán
          numIntTransfersOut                      : String(form.value?.internationalOutputsNumber ?? ''),  //  Número de transferencias internacionales que se enviarán
          other                                   : form.value?.otherMovements ?? '',                         //  Otras
          countriesForTransfers                   : form.value?.countriesMovements ?? '',                     //  Nombre de los países o territorios desde o hacia los que se pretenda recibir o enviar transferencias
          nonFatfOrTaxHavenCountries              : form.value?.gafiCountriesMovements ?? '',                 //  Señalar si alguno de ellos no es perteneciente a GAFI y/o algún Paraíso Fiscal
          intlTransferReasons                     : form.value?.countriesMovementsReason ?? '',               //  Razones por las que pretende recibir o enviar transferencias desde /hacia otros países o territorios 
          acctUsageIntent                         : form.value?.isForMovementsAccount ?? false,               //  La intención de uso de la cuenta es principalmente para depositar y retirar efectivo
          acctUsageIntentDescription              : form.value?.forMovementsAccount ?? '',                    //  ** especificar
          acctUsageOther                          : form.value?.isForOthersMovementsAccount ?? false,         //  La intención de uso de la cuenta es principalmente para depositar y retirar: otros
          specify                                 : form.value?.forOthersMovementsAccount ?? '',              //  ** especificar
        }
      }
    },
    actinverInternalUse: {
      hasReferences                   : form.value.hasClientReference ?? false,
      specify                         : form.value.clientReference ?? '',
      operationsAmountCongruent       : form.value.isMovementSimilar ?? false,
      operationsAmountCongruentSpecify: form.value.movementSimilar ?? '',
      incomeSourceHighRisk            : form.value.isActinverHighRisk ?? false,
      incomeSourceHighRiskSpecify     : form.value.actinverHighRisk ?? '',
      delegateDisposition             : form.value.clientDisposition ?? '',
      visitDate                       : String(convertDate(form.value.clientVisitDate)) ?? '',
      advisorName                     : form.value.adviserName ?? '',
      advisorPosition                 : form.value.adviserRole ?? '',
      financialCenterManager          : form.value.financialManager ?? '',
      financialCenterDirector         : form.value.financialDirector ?? '',
    }
  }

}

type RoleTypeOptions = {
  managerOfficerEmployee: boolean,
  independentProfessional: boolean,
  individualBusinessActivity: boolean
}

function getSelectedRole(options:RoleTypeOptions): string {
  return Object.keys(options).find(key => options[key as keyof RoleTypeOptions] === true) || '';
}

function getIdKey({rfc, nif, tin, nss}: RelatedPpePerson | OwnBusiness): string{
  return ([rfc, nif, tin, nss].findIndex(i => i !== '') + 1).toString() || '';
}

function getIdValue({rfc, nif, tin, nss}: RelatedPpePerson | OwnBusiness): string{
  return [rfc, nif, tin, nss].find(i => i !== '') || '';
}

export function checkpointToPldQuiz(
  {naturalPerson,  incomeSource, ppe, realOwner, transactionProfileUpdate, actinverInternalUse}: PldQuestionarieDataCheckpoint
): PldQuizFormData{

  return {
    // naturalPerson?
    professionActivity                  : naturalPerson?.professionActivity ?? true,
    activity                            : naturalPerson?.indicateActivity ?? '',
    role                                : naturalPerson?.roleType ? getSelectedRole(naturalPerson.roleType) : '',

    providedInfo                        : naturalPerson?.toWhomInformationProvided ?? '',
    product                             : naturalPerson?.productServiceContracted ?? '',
    studiesDegree                       : naturalPerson?.maximumDegreeStudies ?? '',
    isActinverEntity                    : naturalPerson?.everActinverClient ?? false,
    actinverEntity                      : naturalPerson?.actinverContractNumber ?? '',
    isFinancialEntity                   : naturalPerson?.hasRelationOtherFinancialEntity ?? false,
    financialEntity                     : naturalPerson?.whichFinancialEntity ?? '',
    isGafi                              : naturalPerson?.nonGafiOrTaxHavenResident ?? false,
    gafi                                : naturalPerson?.whichCountryIfNonGafi ?? '',
    place                               : naturalPerson?.place ?? '',
    quizDate                            : naturalPerson?.questionnaireApplicationDate ? moment(naturalPerson.questionnaireApplicationDate, 'DD/MM/YYYY') : '',
    fax                                 : naturalPerson?.fax ?? '',
    onlyPhoneReason                     : naturalPerson?.onlyCellphoneReason ?? '',

    employee                            : naturalPerson?.roleType?.managerOfficerEmployee ?? false,
    independent                         : naturalPerson?.roleType?.independentProfessional ?? false,

    //incomeSource - current Employment
    jobName                             : incomeSource?.currentEmployment?.employerName ?? '',
    jobActivity                         : incomeSource?.currentEmployment?.businessActivity ?? '',
    jobAddress                          : incomeSource?.currentEmployment?.address ?? '',
    jobPhone                            : incomeSource?.currentEmployment?.phone ?? '',
    jobRole                             : incomeSource?.currentEmployment?.position ?? '',
    jobMonths                           : Number(incomeSource?.currentEmployment?.seniorityMonths) ?? null,
    jobSalary                           : incomeSource?.currentEmployment?.monthlyIncome ?? null,

    // INCOME SOURCE - previous employment
    previousJobName                     : incomeSource?.currentEmployment?.previousEmployment?.employerName ?? '',
    previousJobActivity                 : incomeSource?.currentEmployment?.previousEmployment?.businessActivity ?? '',
    previousJobAddress                  : incomeSource?.currentEmployment?.previousEmployment?.address ?? '',
    previousJobPhone                    : incomeSource?.currentEmployment?.previousEmployment?.phone ?? '',
    previousJobRole                     : incomeSource?.currentEmployment?.previousEmployment?.position ?? '',
    previousJobMonths                   : Number(incomeSource?.currentEmployment?.previousEmployment?.seniorityMonths) ?? null,
    previousJobSalary                   : Number(incomeSource?.currentEmployment?.previousEmployment?.monthlyIncome) ?? null,

    // INCOME SOURCE -
    extraSalary                         : incomeSource?.currentEmployment?.otherIncome ?? '',
    hasFinancialCompanyDisposition      : incomeSource?.currentEmployment?.hasFinancialResourceDisposalPowers ?? false,
    financialCompanyDisposition         : incomeSource?.currentEmployment?.specify ?? '',
    isGovernmentCompany                 : incomeSource?.currentEmployment?.employerIsNonProfitOrGovOrListed ?? false,
    governmentCompany                   : incomeSource?.currentEmployment?.specifyWhich ?? '',
    isGafiCompany                       : incomeSource?.currentEmployment?.employerIsNonGAFIFinancialInstitution ?? false,
    gafiCompany                         : incomeSource?.currentEmployment?.specifyPattern ?? '',

    //ownBusiness
    businessActivity                    : incomeSource?.ownBusiness?.businessActivity ?? '',
    businessCurp                        : incomeSource?.ownBusiness?.curp,
    businessTypeId                      : incomeSource?.ownBusiness ? getIdKey(incomeSource.ownBusiness) : '',
    businessId                          : incomeSource?.ownBusiness ? getIdValue(incomeSource.ownBusiness) : '',
    businessName                        : incomeSource?.ownBusiness?.businessName ?? '',
    businessAddress                     : incomeSource?.ownBusiness?.address ?? '',
    businessPhone                       : incomeSource?.ownBusiness?.phone ?? '',
    businessFax                         : incomeSource?.ownBusiness?.fax ?? '',
    businessWebPage                     : incomeSource?.ownBusiness?.website ?? '',
    businessRole                        : incomeSource?.ownBusiness?.roleInBusiness ?? '',
    businessTime                        : incomeSource?.ownBusiness?.operatingTimeMonths ?? null,
    businessEmployees                   : incomeSource?.ownBusiness?.employeesNumber ?? null,
    businessAnnualSalary                : incomeSource?.ownBusiness?.annualApproxIncome ?? null,
    businessGeographyZones              : incomeSource?.ownBusiness?.mainGeographicZones ?? '',
    hasFinancialBusinessDisposition     : incomeSource?.ownBusiness?.businessAddressNonGAFICountry ?? false,
    financialBusinessDisposition        : incomeSource?.ownBusiness?.specifyWhich ?? '',
    isBusinessGafiZones                 : incomeSource?.ownBusiness?.hasContractsWithActinverGroup ?? false,
    businessGafiZones                   : incomeSource?.ownBusiness?.indicateWhich ?? '',
    isBusinessActinver                  : incomeSource?.ownBusiness?.isFinancialInstitutionInNonGafiCountry ?? false,
    businessActinver                    : incomeSource?.ownBusiness?.indicate ?? '',
    isBusinessGafi                      : incomeSource?.ownBusiness?.manageDisposeFinancialResources ?? false,
    businessGafi                        : incomeSource?.ownBusiness?.specifyWhichResources ?? '',

    //shareholderOrAssociate
    isMarketSociety            : incomeSource?.shareholderOrAssociate?.isMercantileCompanyPartner ?? false,
    isSocietyOrAssociation     : incomeSource?.shareholderOrAssociate?.isCivilAssociationPartner ?? false,
    societyOrAssociation       : incomeSource?.shareholderOrAssociate?.specifyCompany ?? '',
    companyName                : incomeSource?.shareholderOrAssociate?.businessName ?? '',
    corporatePurpose           : incomeSource?.shareholderOrAssociate?.corporatePurpose ?? '',
    constitutionCountry        : incomeSource?.shareholderOrAssociate?.constitutionCountry ?? '',
    societyAddress             : incomeSource?.shareholderOrAssociate?.address ?? '',
    societyPhone               : incomeSource?.shareholderOrAssociate?.phone ?? '',
    societyFax                 : incomeSource?.shareholderOrAssociate?.fax ?? '',
    societyWebPage             : incomeSource?.shareholderOrAssociate?.website ?? '',
    societyRole                : incomeSource?.shareholderOrAssociate?.roleInCompany ?? '',
    societyTime                : incomeSource?.shareholderOrAssociate?.timeAsPartnerMonths ?? null,
    stockList                  : incomeSource?.shareholderOrAssociate?.coryzaStockExchange ?? false,
    ownSocietyRole             : incomeSource?.shareholderOrAssociate?.positionCompany ?? '',
    ownSocietyTime             : incomeSource?.shareholderOrAssociate?.timePartnerAssociate ?? '',
    ownSocietyPercentage       : incomeSource?.shareholderOrAssociate?.participationPercentage ?? '',
    societyAnnualSalary        : incomeSource?.shareholderOrAssociate?.annualApproxIncome ?? null ,
    societyGeographyZones      : incomeSource?.shareholderOrAssociate?.mainGeographicZones ?? '' ,
    isGafiGeographyZonesSociety: incomeSource?.shareholderOrAssociate?.hasNonGafiAddressOrZones ?? false,
    gafiGeographyZonesSociety  : incomeSource?.shareholderOrAssociate?.which ?? '',
    isActinverSociety          : incomeSource?.shareholderOrAssociate?.actinverContracts ?? false,
    actinverSociety            : incomeSource?.shareholderOrAssociate?.indicateContractNumber ?? '',
    isGafiSociety              : incomeSource?.shareholderOrAssociate?.nonGafiOrTaxHavenFinInst ?? false,
    hasSocietyExtraSalary      : incomeSource?.shareholderOrAssociate?.otherIncomeSources ?? false ,
    societyExtraSalary         : incomeSource?.shareholderOrAssociate?.specifyOtherIncomeSources ?? '',
    isGovernmentSociety        : incomeSource?.shareholderOrAssociate?.governmentOrPublicEntityRelations ?? false,
    governmentSociety          : incomeSource?.shareholderOrAssociate?.specifyGovernmentRelations ?? '',

    // ppe
    isPoliticalExposedPerson            : ppe?.isPpe ?? false,
    politicalExposedPerson              : ppe?.positionAndInstitution ?? '',
    isRelativePoliticalExposedPerson    : ppe?.isPartnerAssociateOrRelativeOfPpe ?? false,

    //relatedPpePersons
    relativePpeCurp                     : ppe?.relatedPpePersons?.curp ?? '',
    relativeTypeId                      : ppe?.relatedPpePersons ? getIdKey(ppe.relatedPpePersons) : '',
    relativePpeId                       : ppe?.relatedPpePersons ? getIdValue(ppe.relatedPpePersons) : '',
    ppeBirthDate                        : ppe?.relatedPpePersons?.birthDate ? moment(ppe.relatedPpePersons.birthDate, 'DD/MM/YYYY') : '',
    relativePpeFirstName                : ppe?.relatedPpePersons?.firstName ?? '',
    relativePpeSecondName               : ppe?.relatedPpePersons?.middleName ?? '',
    relativePpeFirstLastName            : ppe?.relatedPpePersons?.lastName ?? '',
    relativePpeSecondLastName           : ppe?.relatedPpePersons?.secondLastName ?? '',
    relativePpe                         : ppe?.relatedPpePersons?.relationship ?? '',
    foreignerWithoutCurp                : ppe?.relatedPpePersons?.noCurpForeigner ?? false,

    // realOwner
    accountReason          : realOwner?.reasonToOpenWithThoseFunds ?? '',
    clientRelationship     : realOwner?.relationshipWithClient ?? '',
    clientResourcesReason  : realOwner?.reasonToProvideFundsToClient ?? '',
    isOnlyOnePayment       : realOwner?.oneTimeContribution ?? false,
    onlyOnePayment         : Number(realOwner?.approximateAmount) ?? null,
    isCurrentPayment       : realOwner?.contributionPeriodic ?? false,
    currentPayment         : String(realOwner?.approximateAmountPeriodic || realOwner?.indicateApproximateAmount || ''),
    currentPaymentFrequency: realOwner?.periodicity || realOwner?.indicatePeriodicity || '',

    // transactionProfileUpdate
    accountPurpose                      : transactionProfileUpdate?.intendedUseOfAccount ?? '',
    monthPayment                        : transactionProfileUpdate?.approxMonthlyIncomingResources ?? null,
    //monthlyOperations []
    //operationType
    inputsNumber                        : transactionProfileUpdate?.monthlyOperations?.operationType?.numberDeposits ?? '',
    outputsNumber                       : transactionProfileUpdate?.monthlyOperations?.operationType?.numberOfWithdrawals ?? '',
    nationalInputsNumber                : transactionProfileUpdate?.monthlyOperations?.operationType?.numNatTransfersIn ?? '',
    nationalOutputsNumber               : transactionProfileUpdate?.monthlyOperations?.operationType?.numNatTransfersOut ?? '',
    internationalInputsNumber           : transactionProfileUpdate?.monthlyOperations?.operationType?.numIntTransfersIn ?? '',
    internationalOutputsNumber          : transactionProfileUpdate?.monthlyOperations?.operationType?.numIntTransfersOut ?? '',
    otherMovements                      : transactionProfileUpdate?.monthlyOperations?.operationType?.other ?? '',
    countriesMovements                  : transactionProfileUpdate?.monthlyOperations?.operationType?.countriesForTransfers ?? '',
    gafiCountriesMovements              : transactionProfileUpdate?.monthlyOperations?.operationType?.nonFatfOrTaxHavenCountries ?? '',
    countriesMovementsReason            : transactionProfileUpdate?.monthlyOperations?.operationType?.intlTransferReasons ?? '',
    isForMovementsAccount               : transactionProfileUpdate?.monthlyOperations?.operationType?.acctUsageIntent ?? false,
    forMovementsAccount                 : transactionProfileUpdate?.monthlyOperations?.operationType?.acctUsageIntentDescription ?? '',
    isForOthersMovementsAccount         : transactionProfileUpdate?.monthlyOperations?.operationType?.acctUsageOther ?? false,
    forOthersMovementsAccount           : transactionProfileUpdate?.monthlyOperations?.operationType?.specify ?? '',

    // actinverInternalUse
    hasClientReference                  : actinverInternalUse?.hasReferences ?? false,
    clientReference                     : actinverInternalUse?.specify ?? '',
    isMovementSimilar                   : actinverInternalUse?.operationsAmountCongruent ?? false,
    movementSimilar                     : actinverInternalUse?.operationsAmountCongruentSpecify ?? '',
    isActinverHighRisk                  : actinverInternalUse?.incomeSourceHighRisk ?? false,
    actinverHighRisk                    : actinverInternalUse?.incomeSourceHighRiskSpecify ?? '',
    clientDisposition                   : actinverInternalUse?.delegateDisposition ?? '',
    clientVisitDate                     : actinverInternalUse?.visitDate ? moment(actinverInternalUse.visitDate , 'DD/MM/YYYY') : '',
    adviserName                         : actinverInternalUse?.advisorName ?? '',
    adviserRole                         : actinverInternalUse?.advisorPosition ?? '',
    financialManager                    : actinverInternalUse?.financialCenterManager ?? '',
    financialDirector                   : actinverInternalUse?.financialCenterDirector ?? '',
  }
}