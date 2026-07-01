import { CustomerIndentificationAndContactInformation } from "../../models/customer-identification-and-contact";
import { CustomerEmailCheckpoint, CustomerIdentificationAndContactInfoCheckpoint, CustomerIndentificationCheckpoint, CustomerTelephoneCheckpoint } from "../../models/checkpoints/customer-identification-and-contact-checkpoint";
import { Countries, CustomerCountries } from '../../models/customer-country';
import { CustomerIdentificationType, IdentificationType } from '../../models/customer-identification-type';
import { CustomerPhoneType, PhoneType } from '../../models/customer-phone-type';
import { CI_Email, CI_Telephone } from "../../models/customer-customer";

export function identificationAndContactToCheckpoint(request: CustomerIndentificationAndContactInformation): CustomerIdentificationAndContactInfoCheckpoint {
  return {
      identifications: request.identifications
      .filter(item => item?.active === true)
      .map(item => ({
        country: item.identificationCountryId,
        identificationType: item.identificationTypeId,
        identificationNumber: item.identificationNumber,
        expirationDate: item.identificationExpDate ? item.identificationExpDate: '',
      })),
      manifestLetter: request.manifestLetter,
      telephones: request.phones
      .filter(item => item?.active === true)
      .map(item => ({
        type: item.phoneTypeId,
        country: item.phoneCountryId,
        areaCode: item.phoneCodeArea,
        phone: item.phone,
        extension: item.phoneExtension ?? '',
        notificationPhone: item.phoneNotification
      })),
      emails: request.emails
      .filter(item => item?.active === true)
      .map(item => ({
        emailAddress: item.mail,
        notificationEmail: item.mailNotification
      }))
    }

}

export async function checkpointToIdentificationAndContact(
  checkpoint: CustomerIdentificationAndContactInfoCheckpoint, phoneTypes: CustomerPhoneType[], countries: CustomerCountries[], identifications: CustomerIdentificationType[]): Promise<any> {
    return {
      identifications: checkpoint.identifications.map((item: CustomerIndentificationCheckpoint) => ({
        id: crypto.randomUUID(),
        identificationCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        identificationCountryId: item.country,
        identificationType: identifications.find(i => i.type == item.identificationType)?.text ?? '',
        identificationTypeId: item.identificationType,
        identificationNumber: item.identificationNumber,
        identificationExpDate: item.expirationDate,
        active: true,
      })),
      manifestLetter: checkpoint.manifestLetter,
      phones: checkpoint.telephones.map((item: CustomerTelephoneCheckpoint) => ({
        id: crypto.randomUUID(),
        CustomerPhoneType: phoneTypes.find(p => p.telephoneTypeId == item.type)?.telephoneType ?? '',
        phoneTypeId: item.type,
        phoneCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        phoneCountryId: item.country,
        phoneCodeArea: item.areaCode,
        phone: item.phone,
        phoneExtension: item.extension,
        phoneNotification: item.notificationPhone,
        active: true,
      })),
      emails: checkpoint.emails.map((item: CustomerEmailCheckpoint) => ({
        id: crypto.randomUUID(),
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        active: true,
      }))
    };
}

export async function exitentedToIdentificationAndContactEdit(
  response: {
    telephones?: CI_Telephone[];
    emails?: CI_Email[];
    identifications?: any;
  },
  phoneTypes: PhoneType[],
  countries: Countries[],
  identificationsTypes: IdentificationType[]): Promise<any> {
  return {
    identifications: response.identifications.map((item: any) => ({
      id: item.id,
      identificationCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
      identificationCountryId: item.country,
      identificationType: identificationsTypes.find(i => i.type == item.identificationType)?.text ?? '',
      identificationTypeId: item.identificationType,
      identificationNumber: item.identificationNumber,
      identificationExpDate: item.expirationDate,
      active: item.active,
    })),
    manifestLetter: false,
    phones: response?.telephones?.map((item: any) => ({
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
    })),
    emails: response?.emails?.map((item: any) => ({
      id: item.id,
      mail: item.emailAddress,
      mailNotification: item.notificationEmail,
      active: item.active,
    }))
  };
}







