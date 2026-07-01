import { FormGroup } from '@angular/forms';
import { CustomerGeneralInfoCheckpoint, CustomerGeneralInfoSection } from '../../models/checkpoints/customer-general-info-checkpoint';
import { CustomerAddress } from '../../models/customer-address';
import { convertDate, convertDateBack, convertStringToDate, convertStringToDateOrEmpty } from '../../utils/customer-datetime';

import { CustomerAccountManagement } from '../../models/checkpoints/maintenance/customer-general-info-pf-mant-checkpoint';

function emptyToNull(val: any): any {
  return val === '' ? null : val;
}

export function generalInfoToCheckpoint(request: CustomerGeneralInfoSection): CustomerGeneralInfoCheckpoint {
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
    otherAddress: request.otherAddress ?? ''
  } as any;

}

export function checkpointToGeneralInfo(request: CustomerGeneralInfoCheckpoint): CustomerGeneralInfoSection {
  return {
    personClassification: request.personClassification,
    economicActivity: request.economicActivity,
    maritalStatus: request.maritalStatus,
    marriageType: request.marriageType,
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
    federalEntity: request.country !== "MX" ? request.federalEntity : '',
    city: request.country !== "MX" ? request.city : '',
    municipality: request.country !== "MX" ? request.municipality : '',
    federalEntityID: request.country === "MX" ? request.federalEntity : '',
    cityID: request.country === "MX" ? request.city : '',
    municipalityID: request.country === "MX" ? request.municipality : '',
    website: request.website,
    related: request.related,
    relationship: request.relationship,
    institutionName: request.institutionName,
    fiel: request.fiel,
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate).toString() : "",
    domicilieType: request.addressType,
    colony: request.neighborhood,
    otherAddress: request.otherAddress ?? ''
  }

}


export function mapGeneralInfoToForm(storage: CustomerGeneralInfoSection) {
  return {
    personClasification: storage.personClassification,
    economicActivity: storage.economicActivity,
    ocupation: storage.occupation,
    sector: storage.sector,
    actinverEmployee: storage.actinverEmployee,
    actinverEmployeeNumber: storage.employeeNumber,
    civilStatus: storage.maritalStatus,
    maritalType: storage.marriageType,

    profession: storage.profession,
    company: storage.companyName,
    charge: storage.jobTitle,
    phoneCompany: storage.companyPhone,
    //webPageEmployee: storage.companyWebPage,

    isParentOfEmployee: storage.related,
    relationship: storage.relationship,
    institutionDenomination: storage.institutionName,
    webPage: storage.website,

    fiel: storage.fiel,
    expirationFiel: convertDateBack(storage.fielExpirationDate),
    isOwnAccountAct: storage.acting,
    haveResourceProvider: storage.hasSupplier,
  };
}

export function mapFormToGeneralInfo(form: FormGroup, resultDataAddress: CustomerAddress | null): CustomerGeneralInfoSection {
  return {
    personClassification: emptyToNull(form.value.personClasification),
    economicActivity: emptyToNull(form.value.economicActivity),
    maritalStatus: emptyToNull(form.value.civilStatus),
    marriageType: emptyToNull(form.value.maritalType),
    sector: emptyToNull(form.value.sector),
    actinverEmployee: form.value.actinverEmployee,
    employeeNumber: emptyToNull(form.value.actinverEmployeeNumber),
    occupation: emptyToNull(form.value.ocupation),

    profession: emptyToNull(form.value.profession),
    companyName: emptyToNull(form.value.company),
    jobTitle: emptyToNull(form.value.charge),
    companyPhone: emptyToNull(form.value.phoneCompany),

    domicilieType: emptyToNull(resultDataAddress?.addressType ?? ''),
    otherAddress: emptyToNull(resultDataAddress?.other ?? ''),
    country: emptyToNull(resultDataAddress?.country ?? ''),
    postalCode: emptyToNull(resultDataAddress?.postalCode ?? ''),

    federalEntity: emptyToNull(resultDataAddress?.federalEntity ?? ''),
    federalEntityID: emptyToNull(resultDataAddress?.federalEntityID ?? ''),
    city: emptyToNull(resultDataAddress?.city ?? ''),
    cityID: emptyToNull(resultDataAddress?.cityID ?? ''),
    municipality: emptyToNull(resultDataAddress?.municipality ?? ''),
    municipalityID: emptyToNull(resultDataAddress?.municipalityID ?? ''),
    colony: emptyToNull(resultDataAddress?.neighborhood ?? ''),

    street: emptyToNull(resultDataAddress?.street ?? ''),
    externalNumber: emptyToNull(resultDataAddress?.externalNumber ?? ''),
    internalNumber: emptyToNull(resultDataAddress?.internalNumber ?? ''),
    website: emptyToNull(form.value.webPage ?? ''),

    related: emptyToNull(form.value.isParentOfEmployee),
    relationship: emptyToNull(form.value.relationship),
    institutionName: emptyToNull(form.value.institutionDenomination),
    fiel: emptyToNull(form.value.fiel ?? ''),
    fielExpirationDate: emptyToNull(form.value.expirationFiel),
  } as any;
}




