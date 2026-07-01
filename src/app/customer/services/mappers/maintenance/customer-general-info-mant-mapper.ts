import { convertDate } from "../../../utils/customer-datetime"
import { CustomerCompleteGeneralInfoSection, CustomerGeneralInfoSection, CustomerGeneralInfoCheckpoint, CustomerGeneralInfoNonContractCheckpoint } from '../../../models/checkpoints/customer-general-info-checkpoint'
import { CustomerGeneralInfoPfMantCheckpoint } from '../../../models/checkpoints/maintenance/customer-general-info-pf-mant-checkpoint'
import { CustomerGeneralInfoContract } from '../../../models/customer-general-info'
import { checkpointToGeneralInfo } from "../customer-general-info.mapper"

export function generalInfoToCheckpointMant(request: CustomerGeneralInfoSection, contract: CustomerGeneralInfoContract): CustomerGeneralInfoPfMantCheckpoint {
  return {
    personClassification: request.personClassification,
    economicActivity: request.economicActivity,
    maritalStatus: request.maritalStatus,
    marriageType: request.marriageType == "" ? '0' : request.marriageType ?? '0',
    sector: request.sector,
    actinverEmployee: request.actinverEmployee,
    employeeNumber: request.employeeNumber ?? '',
    occupation: request.occupation,
    profession: request.profession,
    companyName: request.companyName ?? '',
    jobTitle: request.jobTitle ?? '',
    companyPhone: request.companyPhone ?? '',
    country: request.country,
    street: request.street,
    externalNumber: request.externalNumber,
    internalNumber: request.internalNumber,
    postalCode: request.postalCode,
    federalEntity: request.country === "MX" ? request.federalEntityID : request.federalEntity,
    city: request.country === "MX" ? request.cityID : request.city,
    municipality: request.country === "MX" ? request.municipalityID : request.municipality,
    website: request.website,
    related: request.related,
    relationship: request.related ? request.relationship : "",
    institutionName: request.related ? request.institutionName : "",
    fiel: request.fiel ?? '',
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate ?? '').toString() : "",
    addressType: request.domicilieType,
    neighborhood: request.colony,
    otherAddress: request.otherAddress ?? '',
    personId: contract.personId ?? 0,
    addressId: contract.addressId ?? 0,
    workDataId: contract.workDataId ?? 0,
    clientId: contract.clientId ?? 0,
    accountRoleId: contract.accountRoleId ?? 0,
    contractData: {
      id: contract.id ?? 0,
      customerStatus: contract.clientStatus,
      applicationStatus: contract.contractStatus,
      openingDate: contract.openDate ?? '',
      initialRiskScore: contract.initialRiskId as any,
      initialRiskDescription: contract.initialRiskDescription ?? '',
      modifiedRiskScore: contract.modifyRiskId as any,
      modifiedRiskDescription: contract.modifyRiskDespcription ?? '',
      origin: contract.origin ?? '',
      upgradeDateN4: contract.n4UpdateDate ?? '',
      numbered: contract.isNumbered,
      //operatesCapital: contract.operateCapitals,
      //operatesCapital: contract.operateCapitals,
      checkProtection: contract.checkProtected,
      properPosition: contract.isOwnPosition,
      socialSecurity: contract.isSocialPrevision,
      biometricsAccount: contract.biometricsAccount,
      facialBiometrics: contract.facialBiometrics,
      enrollmentStatus: contract.enrollmentStatus,
      associateDirector: contract.asociatedDirector,
      directPromoter: contract.directPromote,
      financialCenter: contract.financailCenter,
      withholdingTax: contract.isrPercentage.toString(),
      creditSuisseCommission: contract.isrMonthlyCommision.toString(),
      commissionPercentage: contract.comissionPercentage.toString(),
      legalEntityIGuarantor: contract.isPMSorety,
      brokerageHouse: contract.isBrokerageHouse,
      authorizationConsultCreditReports: contract.authorizationConsultCreditReports,
    },
    accountManagement: {
      id: contract.accountManagementId ?? null,
      externalCustody: contract.externalCustody,
      custody: contract.custody,
      indevalAccount: contract.custodyIndeval,
      financialCenterDelivery: contract.financialCenterDelivery,
      contractManagement: contract.contractManagement,
      managementType: contract.gestionType,
      vip: contract.vip,
    },
    generalInformation: {
      id: contract.generalInformationId,
      reasonOperations: contract.operationReason,
      otherReasonOperations: contract.otherReasons,
      confirmationAuthorized: contract.operationConfiramtionMedia,
      referringProduct: {
        documents: contract.documents,
        transfers: contract.transfers,
        depositInAccount: contract.accountDeposit,
        other: contract.other,
        SpecifyPreferredProduct: contract.otherPreferedProduct,
      }
    },
    associateDirector: {
      id: contract.associateDirectorId,
      directorStatus: contract.asociatedDirectorStatus,
      associateDirectorFolio: contract.asociatedDirectorFolio,
      advisorNumber: contract.asociatedDirectorNumber,
      name: contract.asociatedDirectorName,
    },
    geolocation: {
      id: contract.geolocationId,
      geolocationConsent: contract.consentGeolocalization,
      date: contract.date ?? '',
      hour: contract.time ?? '',
      latitude: contract.latitude ?? '',
      longitude: contract.longitude ?? '',
    },
    otherData: {
      incapacity: contract.incapacity,
      disabilityJustification: contract.incapacityLetter,
      dateOfDeath: contract.dateOfDefunction,
    }
  } as any;
}

export function checkpointMantToGeneralInfo(request: CustomerGeneralInfoPfMantCheckpoint): CustomerCompleteGeneralInfoSection {
  return {
    contractSection: {
      id: request.contractData.id,
      clientStatus: request.contractData.customerStatus,
      contractStatus: request.contractData.applicationStatus,
      saleForceProspect: '',
      openDate: request.contractData.openingDate,
      initialRiskId: request.contractData.initialRiskScore,
      initialRiskDescription: request.contractData.initialRiskDescription,
      modifyRiskId: request.contractData.modifiedRiskScore,
      modifyRiskDespcription: request.contractData.modifiedRiskDescription,
      origin: request.contractData.origin,
      n4UpdateDate: request.contractData.upgradeDateN4,

      isNumbered: request.contractData.numbered,
      operateCapitals: false,
      checkProtected: request.contractData.checkProtection,
      isOwnPosition: request.contractData.properPosition,
      isSocialPrevision: request.contractData.socialSecurity,
      authorizationConsultCreditReports: request.contractData.authorizationConsultCreditReports,
      biometricsAccount: request.contractData.biometricsAccount,
      facialBiometrics: request.contractData.facialBiometrics,

      enrollmentStatus: request.contractData.enrollmentStatus,

      asociatedDirector: request.contractData.associateDirector,
      directPromote: request.contractData.directPromoter,
      financailCenter: request.contractData.financialCenter,

      isrPercentage: +request.contractData.withholdingTax,
      isrMonthlyCommision: +request.contractData.creditSuisseCommission,
      comissionPercentage: +request.contractData.commissionPercentage,

      isPMSorety: request.contractData.legalEntityIGuarantor,
      isBrokerageHouse: request.contractData.brokerageHouse,

      accountManagementId: request.accountManagement?.id,
      externalCustody: request.accountManagement?.externalCustody,
      custody: request.accountManagement?.custody,
      custodyIndeval: request.accountManagement?.indevalAccount,
      financialCenterDelivery: request.accountManagement?.financialCenterDelivery,
      contractManagement: request.accountManagement?.contractManagement,
      gestionType: request.accountManagement?.managementType,
      vip: request.accountManagement?.vip,
      strategyTypes: [], //TODO mapear desde el back cuando este listo equity

      generalInformationId: request.generalInformation?.id,
      operationReason: request.generalInformation?.reasonOperations,
      otherReasons: request.generalInformation?.otherReasonOperations,
      operationConfiramtionMedia: request.generalInformation?.confirmationAuthorized,

      documents: request.generalInformation?.referringProduct.documents,
      transfers: request.generalInformation?.referringProduct.transfers,
      accountDeposit: request.generalInformation?.referringProduct.depositInAccount,
      other: request.generalInformation?.referringProduct.other,
      otherPreferedProduct: request.generalInformation?.referringProduct.SpecifyPreferredProduct,

      associateDirectorId: request.associateDirector?.id,
      asociatedDirectorStatus: request.associateDirector?.directorStatus,
      asociatedDirectorFolio: request.associateDirector?.associateDirectorFolio,
      asociatedDirectorNumber: request.associateDirector?.advisorNumber,
      asociatedDirectorName: request.associateDirector?.name,

      geolocationId: request.geolocation?.id,
      consentGeolocalization: request.geolocation?.geolocationConsent,
      date: request.geolocation?.date,
      time: request.geolocation?.hour,
      latitude: request.geolocation?.latitude,
      longitude: request.geolocation?.longitude,

      incapacity: request.otherData?.incapacity,
      incapacityLetter: request.otherData?.disabilityJustification,
      dateOfDefunction: request.otherData?.dateOfDeath,

      personId: request.personId,
      addressId: request.addressId,
      workDataId: request.workDataId,
      clientId: request.clientId,
      accountRoleId: request.accountRoleId,
    },
    executorSection: null, //TODO aun no hay contrato
    clientSection: checkpointToGeneralInfo(request),
  }
}

export function generalInfoToNonContractCheckpoint(request: CustomerGeneralInfoSection, addressId?: string): CustomerGeneralInfoNonContractCheckpoint {
  const hasAddressData = !!(request.country || request.street || request.postalCode || request.externalNumber);

  return {
    personClassification: request.personClassification,
    economicActivity: request.economicActivity,
    maritalStatus: request.maritalStatus,
    marriageType: request.marriageType || null,
    sector: request.sector,
    actinverEmployee: request.actinverEmployee,
    employeeNumber: request.employeeNumber ?? '',
    occupation: request.occupation,
    profession: request.profession,
    companyName: request.companyName ?? '',
    jobTitle: request.jobTitle ?? '',
    companyPhone: request.companyPhone ?? '',
    addressType: request.domicilieType,
    address: {
      id: addressId ? addressId : null,
      active: addressId ? hasAddressData : null,
      country: request.country || null,
      street: request.street || null,
      externalNumber: request.externalNumber || null,
      internalNumber: request.internalNumber || null,
      postalCode: request.postalCode || null,
      federalEntity: request.country === "MX" ? (request.federalEntityID || null) : (request.federalEntity || null),
      city: request.country === "MX" ? (request.cityID || null) : (request.city || null),
      municipality: request.country === "MX" ? (request.municipalityID || null) : (request.municipality || null),
      neighborhood: request.colony || null,
      otherAddress: request.otherAddress || null,
    },
    website: request.website,
    related: request.related,
    relationship: request.related ? request.relationship : null,
    institutionName: request.related ? request.institutionName : null,
    fiel: request.fiel ?? '',
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate ?? '').toString() : null,
  } as any;
}







