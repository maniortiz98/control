import { Address } from "./address";
import { FiscalSelfDeclaration } from "./checkpoints/fiscal-self-declaration-checkpoint";
import { DataClient } from "./client-data";
import { IdentificationItem } from "./identification-item";
import { MailItem } from "./mail-item";
import { MiscellaneousInfo } from "./miscellaneous-section";
import { PhoneItem } from "./phone-item";
import { RealOwnerPPE } from "./real-owner";

export interface ExecutorInfo{
  executorNumber?: number,
  clientNumber?: string,
  executorId: string | number | null;
  personId: number | null,
  isActiveExecutor: boolean,
  dataSection?: DataClient | null,
  taxSection?: MiscellaneousInfo,
  address: Address | null,
  autoSign: FiscalSelfDeclaration | null,
  ppeInfo: RealOwnerPPE | null,
  identifications: IdentificationItem[],
  phones: PhoneItem[],
  mails: MailItem[],
  idContactData?: number | null,
  isExistingClient?: boolean,
  active: boolean,
}

export interface ExecutorTableInfo{
  executorId: string | number | null,
  registryNumber: number,
  clientNumber: string,
  fiscalNumber: string,
  address: string,
  contact: string,
  isActiveExecutor: boolean,
}
