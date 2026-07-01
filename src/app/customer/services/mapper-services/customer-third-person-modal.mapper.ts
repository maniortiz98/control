import { CustomerAddress } from "../../models/customer-address";
import { CustomerClient, DataClient } from '../../models/customer-client-data';
import { CustomerCountries } from '../../models/customer-country';
import { CustomerIdentificationItem } from '../../models/customer-identification-item';
import { CustomerIdentificationType } from '../../models/customer-identification-type';
import { CustomerMiscellaneousInfo } from '../../models/customer-miscellaneous-section';
import { CustomerPhoneItem } from '../../models/customer-phone-item';
import { CustomerPhoneType } from '../../models/customer-phone-type';
import { CustomerRealOwnerPPE } from '../../models/customer-real-owner';
import { determineTypeIndent } from "../mappers/customer-signature.mapper";
import { CustomerExecutorInfo } from '../../models/customer-executor';
import { CustomerCI_Address, CustomerCI_Email, CustomerCI_GeneralInformation, CustomerCI_InitialData, CustomerCI_PpeInformation, CustomerCI_Telephone, CustomerSections } from '../../models/customer-customer';
import { compareAndReturnIdRfcNifTinNss } from "../../utils/customer-map-rfc-nif-tin-nss";
import { compareGenderAndReturnValue } from "../../utils/customer-maper-gender";

export function existingClientToAddress(response: CustomerCI_Address[]): CustomerAddress {
  return {
    addressId: response[0]?.addressId ?? 0,
    addressAccountId: response[0]?.addressAccountId ?? 0,
    addressRole: response[0]?.addressRole ?? '',
    addressType: response[0]?.addressType ?? '',
    other: response[0]?.other ?? '',
    country: response[0]?.country ?? '',
    postalCode: response[0]?.postalCode ?? '',
    federalEntity: response[0]?.federalEntity ?? '',
    city: response[0]?.city ?? '',
    municipality: response[0]?.municipality ?? '',
    neighborhood: response[0]?.neighborhood ?? '',
    street: response[0]?.street ?? '',
    externalNumber: response[0]?.externalNumber ?? '',
    internalNumber: response[0]?.internalNumber ?? '',
    timeLiveMexico: response[0]?.timeLiveMexico ?? '',
    reasonsOpeningContractMexico: response[0]?.reasonsOpeningContractMexico ?? '',
    proofOfAddressType: response[0]?.proofOfAddressType ?? '',
    addressProofIssueDate: response[0]?.addressProofIssueDate ?? '',
    expirationYear: response[0]?.expirationYear?.toString() ?? '',
    geographicalArea: response[0]?.geographicalArea ?? '',
    deliveryCenter: response[0]?.deliveryCenter ?? '',
  }
}

export function existingClientToClient(response: CustomerCI_InitialData, generalInfo?: CustomerCI_GeneralInformation): CustomerClient {
  return {
    curp: response?.curp ?? '',
    foreignerWithoutCurp: response?.foreignerWithoutCurp ?? false,
    typeIden: compareAndReturnIdRfcNifTinNss(
      response.rfc ?? '',
      response.nif ?? '',
      response.tin ?? '',
      response.nss ?? ''
    ),
    rfc: response?.rfc ?? '',
    nif: response?.rfc ?? '',
    tin: response?.rfc ?? '',
    nss: response?.rfc ?? '',
    firstName: response?.firstName ?? '',
    middleName: response?.middleName ?? '',
    dateOfBirth: response?.dateOfBirth ?? '',
    firstLastName: response?.firstLastName ?? '',
    secondLastName: response?.secondLastName ?? '',
    gender: response?.gender ? compareGenderAndReturnValue(Number(response.gender)) : '1',
    maritalStatus: generalInfo?.maritalStatus ?? '',
    nationality: response?.nationality ?? '',
    countryOfBirth: response?.countryOfBirth ?? '',
    stateOfBirth: response?.stateOfBirth ?? '',
    cityOfBirth: response?.cityOfBirth ?? '',
    ppe: response?.ppe ?? false,
  }
}


export function existingClientToIdentifications(
  response: any[],
  identificationsTypes: CustomerIdentificationType[],
  countries: CustomerCountries[]
): CustomerIdentificationItem[] {

  return response.map((item: any): CustomerIdentificationItem => ({
    id: item.id,
    identificationCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
    identificationCountryId: item.country,
    identificationType: identificationsTypes.find(i => i.type === item.identificationType)?.text ?? '',
    identificationTypeId: item.identificationType,
    identificationNumber: item.identificationNumber,
    identificationExpDate: item.expirationDate,
    active: item.active,
    isSaved: true,
  }));
}

export function existingClientToPhones(response: CustomerCI_Telephone[], phoneTypes: CustomerPhoneType[], countries: CustomerCountries[]): CustomerPhoneItem[]{
  return response.map((item: any): CustomerPhoneItem => ({
    id: item.id,
    phoneType: phoneTypes.find(p => p.telephoneTypeId == item.type)?.telephoneType ?? '',
    phoneTypeId: item.type,
    phoneCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
    phoneCountryId: item.country,
    phoneCodeArea: item.areaCode,
    phone: item.phone,
    phoneExtension: item.extension,
    phoneNotification: item.notificationPhone,
    active: item.active,
    isSaved: true,
  }));
}


export function existingClientToMails(response: CustomerCI_Email[]){
  return response.map((item: any) => ({
    id: item.id,
    mail: item.emailAddress,
    mailNotification: item.notificationEmail,
    active: item.active,
    isSaved: true,
  }))
}

export function existingClientToPpe(response: CustomerCI_PpeInformation): CustomerRealOwnerPPE{
  return {
    ppe: response?.ppe ?? false,
    tppe: response?.ppeType ?? '',
    positionHeld: response?.positionHeld ?? '',
    expirationDate: response?.expirationDate ?? '',
    fppe: response?.hasFamilyPpe ?? false,
    dataFamily: response.familyData?.map((item: any) => ({
      accountRoleId: item.accountRole ?? '',
      curp:  item.curp ?? '',
      foreignerWithoutCurp:  item.foreignerWithoutCurp ?? '',
      rfc:  rfcNifTinSsnValue(item),
      firstName:  item.firstName ?? '',
      middleName:  item.middleName ?? '',
      dateOfBirth:  item.dateOfBirth ?? '',
      firstLastName:  item.firstLastName ?? '',
      secondLastName:  item.secondLastName ?? '',
      nationality:  item.nationality ?? '',
      countryOfBirth:  item.countryOfBirth ?? '',
      countryTaxCodeAbroad:  '',
      typeIden: determineTypeIndent(item),
      chargeDueDate: item.positionHeldEndDate ?? '',
      relationship: item.relationship ?? '',
      positionHeld: item.positionHeld ?? '',
    })) ?? []
  }
}

export function existingClientToDataClient(response: CustomerCI_InitialData, generalInfo?: CustomerCI_GeneralInformation): DataClient {
  return {
    firstName            : response.firstName ?? '',
    middleName           : response.middleName ?? '',
    firstLastName        : response.firstLastName ?? '',
    secondLastName       : response.secondLastName ?? '',
    ppe                  : response.ppe ?? false,
    bankAreaTypeId       : '',
    contraTypeId         : '',
    typeContractSubtypeId: '',
    curp                 : response.curp ?? '',
    foreignerWithoutCurp : response.foreignerWithoutCurp ?? false,

    typeIden: compareAndReturnIdRfcNifTinNss(
      response.rfc ?? '',
      response.nif ?? '',
      response.tin ?? '',
      response.nss ?? ''
    ),
    rfc           : response.rfc ?? '',
    dateOfBirth   : response.dateOfBirth ?? '',
    gender        : response.gender ? compareGenderAndReturnValue(Number(response.gender)) : '1',
    maritalStatus : generalInfo?.maritalStatus ?? '6',
    nationality   : response.nationality ?? '',
    countryOfBirth: response.countryOfBirth ?? '',
    stateOfBirth  : response.stateOfBirth ?? '',
    cityOfBirth   : response.cityOfBirth ?? '',
    isSaved       : false,
    isView        : false
  }
}

export function existingClientToMisceSection(response: CustomerCI_GeneralInformation, fiscal: any): CustomerMiscellaneousInfo{
  return {
  relationship: null,
  economicActivity: response.economicActivity ?? '',
  occupation: response.occupation ?? "",
  fiscalCountry: fiscal?.fiscalResidences?.[0]?.country ?? '',
  ipabTitularityPercent: 0,
  retentionIsr: 0,
  signClass: "",
  workCompany:response.companyName ?? "",
  positionHeld:response.jobTitle ?? "",
  phoneBusiness:response.companyPhone ?? "",
  profession: response.profession ?? ""
  }
}

export function rfcNifTinSsnValue(data: Identifiable): string{
  if(data.rfc){
    return data.rfc;
  } else if(data.nif){
    return data.nif;
  } else if(data.tin){
    return data.tin;
  } else if(data.nss){
    return data.nss;
  } else {
    return ''
  }
}

type Identifiable = {
  rfc?: string;
  nif?: string;
  tin?: string;
  nss?: string;
}

















