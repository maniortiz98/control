import { CustomerIdentificationItem } from './customer-identification-item';
import { CustomerMailItem } from './customer-mail-item';
import { CustomerPhoneItem } from './customer-phone-item';

export interface CustomerIndentificationAndContactInformation {
  identifications: CustomerIdentificationItem[],
  manifestLetter: boolean;
  phones: CustomerPhoneItem[];
  emails: CustomerMailItem[];
}

export interface CustomerContactInformationPm {
  phones: CustomerPhoneItem[];
  emails: CustomerMailItem[];
}




export type IndentificationAndContactInformation = CustomerIndentificationAndContactInformation;
export type ContactInformationPm = CustomerContactInformationPm;


