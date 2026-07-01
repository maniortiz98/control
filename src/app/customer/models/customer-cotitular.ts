import { CustomerAddress } from "./customer-address";
import { CustomerFiscalSelfDeclaration } from './checkpoints/customer-fiscal-self-declaration-checkpoint';
import { DataClient } from './customer-client-data';
import { CustomerIdentificationItem } from './customer-identification-item';
import { CustomerMailItem } from './customer-mail-item';
import { CustomerMiscellaneousInfo } from './customer-miscellaneous-section';
import { CustomerPhoneItem } from './customer-phone-item';
import { CustomerRealOwnerPPE } from './customer-real-owner';

export interface CustomerCotitularInfo{
  coHolderId:                 number | null,
  customerNumber?:            number | null,
  personId:                   number | null,
  active:                     boolean,
  cotitularNumber?: number,
  clientNumber?: string,
  cotitularId?: string;
  dataSection?: DataClient | null,
  taxSection?: CustomerMiscellaneousInfo,
  address: CustomerAddress | null,
  autoSign: CustomerFiscalSelfDeclaration | null,
  ppeInfo: CustomerRealOwnerPPE | null,
  identifications: CustomerIdentificationItem[],
  manifestLetter: boolean,
  phones: CustomerPhoneItem[],
  mails: CustomerMailItem[]
  idContactData?: number | null,
  isExistingClient?: boolean,
}

export interface CustomerCotitularTableInfo{
  cotitularId?: string,
  cotitularNumber: number,
  clientNumber: string,
  rfc: string,
  domicile: string,
  contact: string,
  ipabPercentage: string,
  isrPercentage: string,
}

export function cotitularInfoToTable(newItem: CustomerCotitularInfo, address: string): CustomerCotitularTableInfo{
  return {
    cotitularId: newItem.cotitularId,
    cotitularNumber: newItem?.cotitularNumber ?? 1,
    clientNumber: newItem?.clientNumber && newItem.clientNumber !== '' ? newItem.clientNumber : '-',
    rfc: newItem?.dataSection?.rfc ?? 'NO RFC',
    domicile: address,
    contact: newItem?.phones[0]?.phone ?? 'N/A',
    ipabPercentage: (newItem.taxSection?.ipabTitularityPercent ?? '0') + '%',
    isrPercentage: (newItem.taxSection?.retentionIsr ?? '0') + '%'
  }
}

export type CotitularInfo = CustomerCotitularInfo;
export type CotitularTableInfo = CustomerCotitularTableInfo;






