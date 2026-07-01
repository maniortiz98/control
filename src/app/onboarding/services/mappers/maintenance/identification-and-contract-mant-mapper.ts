import { EmailCheckpointMant, IdentificationAndContactInfoCheckpointMant, IndentificationCheckpointMant, TelephoneCheckpointMant } from "../../../models/checkpoints/maintenance/identification-and-contact-mant-checkpoint";
import { Countries } from "../../../models/country";
import { IndentificationAndContactInformation } from "../../../models/identification-and-contact";
import { IdentificationType } from "../../../models/identification-type";
import { PhoneType } from "../../../models/phone-type";

export function identificationAndContactToCheckpointMant(request: IndentificationAndContactInformation): IdentificationAndContactInfoCheckpointMant {
  return {
      identifications: request.identifications.map(item => ({
        id: typeof item.id === 'string' ? null : Number(item.id),
        country: item.identificationCountryId,
        identificationType: item.identificationTypeId,
        identificationNumber: item.identificationNumber,
        expirationDate: item.identificationExpDate ? item.identificationExpDate: '',
        active: item.active
      })),
      manifestLetter: request.manifestLetter,
      telephones: request.phones.map(item => ({
        id: typeof item.id === 'string' ? null : Number(item.id),
        type: item.phoneTypeId,
        country: item.phoneCountryId,
        areaCode: item.phoneCodeArea,
        phone: item.phone,
        extension: item.phoneExtension ?? '',
        notificationPhone: item.phoneNotification,
        active: item.active
      })),
      emails: request.emails.map(item => ({
        id: typeof item.id === 'string' ? null : Number(item.id),
        emailAddress: item.mail,
        notificationEmail: item.mailNotification,
        active: item.active
      }))
    }

}

export async function checkpointMantToIdentificationAndContact(
  checkpoint: IdentificationAndContactInfoCheckpointMant, phoneTypes: PhoneType[], countries: Countries[], identifications: IdentificationType[]): Promise<any> {
    return {
      identifications: checkpoint.identifications.map((item: IndentificationCheckpointMant) => ({
        id: item.id,
        identificationCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        identificationCountryId: item.country,
        identificationType: identifications.find(i => i.type == item.identificationType)?.text ?? '',
        identificationTypeId: item.identificationType,
        identificationNumber: item.identificationNumber,
        identificationExpDate: item.expirationDate,
        active: item.active,
      })),
      manifestLetter: checkpoint.manifestLetter,
      phones: checkpoint.telephones.map((item: TelephoneCheckpointMant) => ({
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
      emails: checkpoint.emails.map((item: EmailCheckpointMant) => ({
        id: item.id,
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        active: item.active,
      }))
    };
}
