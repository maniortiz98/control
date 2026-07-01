import { IdentificationAndContactInfoCheckpoint } from "../../../models/checkpoints/customer-identification-and-contact-checkpoint";
import { Countries } from "../../../models/customer-country";
import { IdentificationType } from "../../../models/customer-identification-type";
import { PhoneType } from "../../../models/customer-phone-type";

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
        active: item.active
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
        active: item.active
      })),
      emails: response.emails.map((item: any) => ({
        id: item.id,
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        active: item.active
      }))
    };
}

