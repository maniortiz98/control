import { CustomerMailItem } from './customer-mail-item';
import { CustomerPhoneItem } from './customer-phone-item';

export interface CustomerInternSection {
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

export interface CustomerInternTrust extends CustomerInternSection{
  phones: CustomerPhoneItem[],
  mails: CustomerMailItem[],
  recomendations: string
}

export interface CustomerInternTrustRequest extends CustomerInternTrust{
  trustRequestId: string,
  creationDate: string,
  status: string,
}

export type InternSection = CustomerInternSection;
export type InternTrust = CustomerInternTrust;
export type InternTrustRequest = CustomerInternTrustRequest;


