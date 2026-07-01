import { convertDate } from "../../../shared/utils/datetime";
import { GeneralInfoSection } from "../../models/checkpoints/general-info-checkpoint";

export const DEFAULT_PERSON_DATA = {
  "personClassification": "",
  "economicActivity": "",
  "maritalStatus": "",
  "marriageType": "",
  "sector": "",
  "actinverEmployee": false,
  "employeeNumber": "",
  "occupation": "",
  "profession": "",
  "companyName": "",
  "jobTitle": "",
  "companyPhone": "",
  "country": "",
  "street": "",
  "externalNumber": "",
  "internalNumber": "",
  "postalCode": "",
  "federalEntity": "",
  "city": "",
  "municipality": "",
  "website": "",
  "related": "",
  "relationship": "",
  "institutionName": "",
  "fiel": "",
  "fielExpirationDate": "",
  "banxicoAuthorization": true,
  "nonGuaranteedByIPAB": "",
  "acting": true,
  "hasSupplier": false,
  "operatesChanges": true,
  "addressType": "",
  "neighborhood": ""
}

export interface GenPersonData {
  personClassification: string;
  economicActivity: string;
  maritalStatus: string;
  marriageType: string;
  sector: string;
  actinverEmployee: boolean;
  employeeNumber: string;
  occupation: string;
  profession: string;
  companyName: string;
  jobTitle: string;
  companyPhone: string;
  country: string;
  street: string;
  externalNumber: string;
  internalNumber: string;
  postalCode: string;
  federalEntity: string;
  city: string;
  municipality: string;
  website: string;
  related: boolean;
  relationship: string;
  institutionName: string;
  fiel: string;
  fielExpirationDate: string;
  banxicoAuthorization: boolean;
  nonGuaranteedByIPAB: string;
  acting: boolean;
  hasSupplier: boolean;
  operatesChanges: boolean;
  addressType: string;
  neighborhood: string;
}

export function mapGeneralInfoInit(data:GeneralInfoSection | null):GenPersonData{
 return {
  personClassification: data?.personClassification ?? '',
  economicActivity: data?.economicActivity ?? '',
  maritalStatus: data?.maritalStatus ?? '',
  marriageType: data?.marriageType ?? '',
  sector: data?.sector ?? '',
  actinverEmployee: data?.actinverEmployee ?? false,
  employeeNumber: data?.employeeNumber ?? '',
  occupation: data?.occupation ?? '',
  profession: data?.profession ?? '',
  companyName: data?.companyName ?? '',
  jobTitle: data?.jobTitle ?? '',
  companyPhone: data?.companyPhone ?? '',
  country: data?.country ?? '',
  street: data?.street ?? '',
  externalNumber: data?.externalNumber ?? '',
  internalNumber: data?.internalNumber ?? '',
  postalCode: data?.postalCode ?? '',
  federalEntity: data?.country === "MX" ? data?.federalEntityID : data?.federalEntity ?? '',
  city: data?.country === "MX" ? data?.cityID : data?.city ?? '',
  municipality: data?.country === "MX" ? data?.municipalityID : data?.municipality ?? '',
  website: data?.website ?? '',
  related: data?.related ?? false,
  relationship: data?.relationship ?? '',
  institutionName: data?.institutionName ?? '',
  fiel: data?.fiel ?? '',
  fielExpirationDate: convertDate(data?.fielExpirationDate ?? '').toString(),
  banxicoAuthorization: true,
  nonGuaranteedByIPAB: data?.nonGuaranteedByIPAB ?? '',
  acting: data?.acting ?? false,
  hasSupplier: data?.hasSupplier ?? false ,
  operatesChanges: data?.operatesChanges ?? true,
  addressType: data?.domicilieType ?? '',
  neighborhood: data?.colony ?? '',
}
}
