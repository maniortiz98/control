import { IndentificationAndContactInformation } from "../../models/identification-and-contact";
import { EmailCheckpoint, IdentificationAndContactInfoCheckpoint, IndentificationCheckpoint, TelephoneCheckpoint } from "../../models/checkpoints/identification-and-contact-checkpoint";
import { Countries } from "../../models/country";
import { IdentificationType } from "../../models/identification-type";
import { PhoneType } from "../../models/phone-type";
import { CI_Email, CI_Telephone } from "../../../shared/models/customer";

export function identificationAndContactToCheckpoint(request: IndentificationAndContactInformation): IdentificationAndContactInfoCheckpoint {
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
  checkpoint: IdentificationAndContactInfoCheckpoint, phoneTypes: PhoneType[], countries: Countries[], identifications: IdentificationType[]): Promise<any> {
    return {
      identifications: checkpoint.identifications.map((item: IndentificationCheckpoint) => ({
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
      phones: checkpoint.telephones.map((item: TelephoneCheckpoint) => ({
        id: crypto.randomUUID(),
        phoneType: phoneTypes.find(p => p.telephoneTypeId == item.type)?.telephoneType ?? '',
        phoneTypeId: item.type,
        phoneCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        phoneCountryId: item.country,
        phoneCodeArea: item.areaCode,
        phone: item.phone,
        phoneExtension: item.extension,
        phoneNotification: item.notificationPhone,
        active: true,
      })),
      emails: checkpoint.emails.map((item: EmailCheckpoint) => ({
        id: crypto.randomUUID(),
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        active: true,
      }))
    };
}

export async function exitentedClientToIdentificationAndContact(
  response: IdentificationAndContactInfoCheckpoint,
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
        isSaved: true,
      })),
      manifestLetter: false,
      phones: response.telephones.map((item: any) => ({
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
      })),
      emails: response.emails.map((item: any) => ({
        id: item.id,
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        active: item.active,
        isSaved: true,
      }))
    };
}

export async function exitentedToIdentificationAndContact(
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
      isSaved: true,
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
      isSaved: true,
    })),
    emails: response?.emails?.map((item: any) => ({
      id: item.id,
      mail: item.emailAddress,
      mailNotification: item.notificationEmail,
      active: item.active,
      isSaved: true,
    }))
  };
}
