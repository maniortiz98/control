import { CustomerEmailCheckpointMant, CustomerIdentificationAndContactInfoCheckpointMant, CustomerIndentificationCheckpointMant, CustomerTelephoneCheckpointMant } from "../../../models/checkpoints/maintenance/customer-identification-and-contact-mant-checkpoint";
import { CustomerCountries } from '../../../models/customer-country';
import { CustomerIndentificationAndContactInformation } from "../../../models/customer-identification-and-contact";
import { CustomerIdentificationType } from '../../../models/customer-identification-type';
import { CustomerPhoneType } from '../../../models/customer-phone-type';

export function identificationAndContactToCheckpointMant(request: CustomerIndentificationAndContactInformation): CustomerIdentificationAndContactInfoCheckpointMant {
  return {
      identifications: request.identifications.map(item => ({
        id: typeof item.id === 'string' ? null : item?.id?.toString(),
        country: item.identificationCountryId,
        identificationType: item.identificationTypeId,
        identificationNumber: item.identificationNumber,
        expirationDate: item.identificationExpDate ? item.identificationExpDate: '',
        active: item.active
      })),
      manifestLetter: request.manifestLetter,
      telephones: request.phones.map(item => ({
        id: typeof item.id === 'string' ? null : item?.id?.toString(),
        type: item.phoneTypeId,
        country: item.phoneCountryId,
        areaCode: item.phoneCodeArea,
        phone: item.phone,
        extension: item.phoneExtension ?? '',
        notificationPhone: item.phoneNotification,
        active: item.active
      })),
      emails: request.emails.map(item => ({
        id: typeof item.id === 'string' ? null : item?.id?.toString(),
        emailAddress: item.mail,
        notificationEmail: item.mailNotification,
        active: item.active
      }))
    }

}

const shouldOmit = (item: any) =>
  (item.id === null || item.id === undefined || item.id === '' || item.id === 0) &&
  item.active === false;

const filterList = (list: any[]) => list?.filter(item => !shouldOmit(item));

export function mapCheckpointMant(request: any) {
  return {
    identifications: filterList(request.identifications),
    manifestLetter: request.manifestLetter,
    telephones: filterList(request.telephones),
    emails: filterList(request.emails)
  };
}


export async function checkpointMantToIdentificationAndContact(
  checkpoint: CustomerIdentificationAndContactInfoCheckpointMant, phoneTypes: CustomerPhoneType[], countries: CustomerCountries[], identifications: CustomerIdentificationType[]): Promise<any> {
    return {
      identifications: checkpoint.identifications.map((item: CustomerIndentificationCheckpointMant) => ({
        id: item.id,
        identificationCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        identificationCountryId: item.country,
        identificationType: identifications.find(i => i.type == item.identificationType)?.text ?? '',
        identificationTypeId: item.identificationType,
        identificationNumber: item.identificationNumber,
        identificationExpDate: item.expirationDate,
        isSaved: item.active,
      })),
      manifestLetter: checkpoint.manifestLetter,
      phones: checkpoint.telephones.map((item: CustomerTelephoneCheckpointMant) => ({
        id: item.id,
        CustomerPhoneType: phoneTypes.find(p => p.telephoneTypeId == item.type)?.telephoneType ?? '',
        phoneTypeId: item.type,
        phoneCountry: countries.find(c => c.countryId === item.country)?.country ?? '',
        phoneCountryId: item.country,
        phoneCodeArea: item.areaCode,
        phone: item.phone,
        phoneExtension: item.extension,
        phoneNotification: item.notificationPhone,
        isSaved: item.active,
      })),
      emails: checkpoint.emails.map((item: CustomerEmailCheckpointMant) => ({
        id: item.id,
        mail: item.emailAddress,
        mailNotification: item.notificationEmail,
        isSaved: item.active,
      }))
    };
}









