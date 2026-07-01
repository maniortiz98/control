export interface CustomerPhoneItem{
  id: string | number,
  phone: string,
  phoneType: string,
  phoneTypeId: string,
  phoneCountry: string,
  phoneCountryId: string,
  phoneCodeArea: string,
  phoneLada?: string,
  phoneExtension?: string,
  phoneNotification: boolean,
  active: boolean,
  isSaved?: boolean,
}




export type PhoneItem = CustomerPhoneItem;

