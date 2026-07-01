import { MailItem } from "./mail-item";
import { PhoneItem } from "./phone-item";

export interface InternSection {
  asesorId: string,
  asesorName: string,

  branchId: string,
  branchName: string,

  clientNumber: string,
  trustNumber: string,
  contractBankAmount: string,
  contractBrokerAmount: string,
  trustType: string,

  internTrustType: number,
  trustPersonType: number,
  profileType: number,
}

export interface InternTrust extends InternSection{
  phones: PhoneItem[],
  mails: MailItem[],
  recomendations: string
}

export interface InternTrustRequest extends InternTrust{
  trustRequestId: string,
  creationDate: string,
  status: string,
}
