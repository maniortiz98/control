import { CustomerAddress } from "./customer-address";
import { CustomerFiscalSelfDeclaration } from './checkpoints/customer-fiscal-self-declaration-checkpoint';
import { DataClient } from './customer-client-data';
import { CustomerIdentificationItem } from './customer-identification-item';
import { CustomerMailItem } from './customer-mail-item';
import { CustomerMiscellaneousInfo } from './customer-miscellaneous-section';
import { CustomerPhoneItem } from './customer-phone-item';
import { CustomerRealOwnerPPE } from './customer-real-owner';

export interface CustomerExecutorInfo{
  executorNumber?: number,
  clientNumber?: string,
  executorId: string | number | null;
  personId: number | null,
  isActiveExecutor: boolean,
  dataSection?: DataClient | null,
  taxSection?: CustomerMiscellaneousInfo,
  address: CustomerAddress | null,
  autoSign: CustomerFiscalSelfDeclaration | null,
  ppeInfo: CustomerRealOwnerPPE | null,
  identifications: CustomerIdentificationItem[],
  phones: CustomerPhoneItem[],
  mails: CustomerMailItem[],
  idContactData?: number | null,
  isExistingClient?: boolean,
  active: boolean,
}

export interface CustomerExecutorTableInfo{
  executorId: string | number | null,
  registryNumber: number,
  clientNumber: string,
  fiscalNumber: string,
  address: string,
  contact: string,
  isActiveExecutor: boolean,
}

export type ExecutorInfo = CustomerExecutorInfo;
export type ExecutorTableInfo = CustomerExecutorTableInfo;






