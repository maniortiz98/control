import { CustomerAddress } from "./customer-address";
import { DataClient } from './customer-client-data';
import { CustomerIdentificationItem } from './customer-identification-item';
import { CustomerLegalPowerInfo } from "./customer-legal-power-section";
import { CustomerMailItem } from './customer-mail-item';
import { CustomerMiscellaneousInfo } from './customer-miscellaneous-section';
import { CustomerPhoneItem } from './customer-phone-item';
import { CustomerRealOwnerPPE } from './customer-real-owner';

export interface CustomerAttoneryInfo{
  customerNumber?: number | null,
  idContactData?: number | null,
  legalProxyId: number | null,
  personId: number | null,
  active: boolean,
  attoneryNumber?: number,
  clientNumber?: string,
  attoneryId: string;
  dataSection: DataClient | null,
  taxSection: CustomerMiscellaneousInfo | null,
  address: CustomerAddress | null,
  ppeInfo: CustomerRealOwnerPPE | null,
  identifications: CustomerIdentificationItem[]
  manifestLetter: boolean,
  phones: CustomerPhoneItem[],
  mails: CustomerMailItem[],
  legalPowerSection: CustomerLegalPowerInfo | null,
  preFillAdress: boolean,
}

export interface CustomerAttoneryTableInfo{
  attoneryNumber: number,
  clientNumber: string,
  attoneryId: string;
  rfc: string,
  domicile: string,
  ppe: string,
}

export function attoneryInfoToTable(newItem: CustomerAttoneryInfo, address: string): CustomerAttoneryTableInfo {
  return {
    attoneryId: newItem.attoneryId,
    attoneryNumber: newItem?.attoneryNumber ?? 1,
    clientNumber: newItem?.clientNumber ?? '-',
    rfc: newItem?.dataSection?.rfc ?? 'NO RFC',
    domicile: address,
    ppe: newItem.ppeInfo?.ppe ? 'Si' : 'NO',
  }
}

export type AttoneryInfo = CustomerAttoneryInfo;
export type AttoneryTableInfo = CustomerAttoneryTableInfo;






