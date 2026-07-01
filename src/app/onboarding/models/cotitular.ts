import { Address } from "./address";
import { FiscalSelfDeclaration } from "./checkpoints/fiscal-self-declaration-checkpoint";
import { DataClient } from "./client-data";
import { IdentificationItem } from "./identification-item";
import { MailItem } from "./mail-item";
import { MiscellaneousInfo } from "./miscellaneous-section";
import { PhoneItem } from "./phone-item";
import { RealOwnerPPE } from "./real-owner";

export interface CotitularInfo{
  coHolderId:                 number | null,
  customerNumber?:            number | null,
  personId:                   number | null,
  active:                     boolean,
  cotitularNumber?: number,
  clientNumber?: string,
  cotitularId?: string;
  dataSection?: DataClient | null,
  taxSection?: MiscellaneousInfo,
  address: Address | null,
  autoSign: FiscalSelfDeclaration | null,
  ppeInfo: RealOwnerPPE | null,
  identifications: IdentificationItem[],
  manifestLetter: boolean,
  phones: PhoneItem[],
  mails: MailItem[]
  idContactData?: number | null,
  isExistingClient?: boolean,
}

export interface CotitularTableInfo{
  cotitularId?: string,
  cotitularNumber: number,
  clientNumber: string,
  rfc: string,
  domicile: string,
  contact: string,
  ipabPercentage: string,
  isrPercentage: string,
}

export function cotitularInfoToTable(newItem: CotitularInfo, address: string): CotitularTableInfo{
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
