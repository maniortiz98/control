import { Address } from "./address";
import { DataClient } from "./client-data";
import { IdentificationItem } from "./identification-item";
import { LegalPowerInfo } from "./legal-power-section";
import { MailItem } from "./mail-item";
import { MiscellaneousInfo } from "./miscellaneous-section";
import { PhoneItem } from "./phone-item";
import { RealOwnerPPE } from "./real-owner";

export interface AttoneryInfo{
  customerNumber?: number | null,
  idContactData?: number | null,
  legalProxyId: number | null,
  personId: number | null,
  active: boolean,
  attoneryNumber?: number,
  clientNumber?: string,
  attoneryId: string;
  dataSection: DataClient | null,
  taxSection: MiscellaneousInfo | null,
  address: Address | null,
  ppeInfo: RealOwnerPPE | null,
  identifications: IdentificationItem[]
  manifestLetter: boolean,
  phones: PhoneItem[],
  mails: MailItem[],
  legalPowerSection: LegalPowerInfo | null,
  preFillAdress: boolean,
}

export interface AttoneryTableInfo{
  attoneryNumber: number,
  clientNumber: string,
  attoneryId: string;
  rfc: string,
  domicile: string,
  ppe: string,
}

export function attoneryInfoToTable(newItem: AttoneryInfo, address: string): AttoneryTableInfo {
  return {
    attoneryId: newItem.attoneryId,
    attoneryNumber: newItem?.attoneryNumber ?? 1,
    clientNumber: newItem?.clientNumber ?? '-',
    rfc: newItem?.dataSection?.rfc ?? 'NO RFC',
    domicile: address,
    ppe: newItem.ppeInfo?.ppe ? 'Si' : 'NO',
  }
}
