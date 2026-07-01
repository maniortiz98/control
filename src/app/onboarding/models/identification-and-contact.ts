import { IdentificationItem } from "./identification-item";
import { MailItem } from "./mail-item";
import { PhoneItem } from "./phone-item";

export interface IndentificationAndContactInformation {
  identifications: IdentificationItem[],
  manifestLetter: boolean;
  phones: PhoneItem[];
  emails: MailItem[];
}

export interface ContactInformationPm {
  phones: PhoneItem[];
  emails: MailItem[];
}



