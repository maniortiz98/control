import { GeneralInfoSection } from "../../../models/checkpoints/customer-general-info-checkpoint";
import { CI_GeneralInformation } from "../../../models/customer-customer";
import { convertDate } from "../../../utils/customer-datetime";

export function existingClientToGeneralInfo(request: CI_GeneralInformation | null): GeneralInfoSection | null{
  if(!request) {
    return null;
  }
  return {
    personClassification: request.personClassification ?? '',
    economicActivity: request.economicActivity ?? '',
    maritalStatus: request.maritalStatus ?? '',
    marriageType: request.marriageType ?? '',
    sector: request.sector ?? '',
    actinverEmployee: request.actinverEmployee,
    employeeNumber: request.employeeNumber,
    occupation: request.occupation,
    profession: request.profession,
    companyName: request.companyName,
    jobTitle: request.jobTitle,
    companyPhone: request.companyPhone,
    addressId: request.address?.addressId ?? null,
    country: request.address?.country ?? '',
    street: request.address?.street ?? '',
    externalNumber: request.address?.externalNumber ?? '',
    internalNumber: request.address?.internalNumber ?? '',
    postalCode: request.address?.postalCode ?? '',
    federalEntity: request.address?.federalEntity ?? '',
    city: request.address?.city ?? '',
    municipality: request.address?.municipality ?? '',
    federalEntityID: request.address?.federalEntity ?? '',
    cityID: request.address?.city ?? '',
    municipalityID: request.address?.municipality ?? '',
    website: request.website ?? '',
    related: request.related,
    relationship: request.relationship ?? '',
    institutionName: request.institutionName ?? '',
    fiel: request.fiel ?? '',
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate ?? '').toString(): "",
    domicilieType: request.address?.addressType ?? '',
    colony: request.address?.neighborhood ?? '',
    otherAddress: request.address?.otherAddress ?? ''
  } as any;
}
