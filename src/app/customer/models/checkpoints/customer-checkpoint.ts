import { CustomerCheckpointSections } from "./customer-sections.type";
export interface CustomerCheckpoint<T> {
  applicationId?: string;
  clientId?: string | number;
  customerNumber?: string | number;
  onboardingId?: number;
  sectionId: string[] | string;
  data?: T;
}

export interface CustomerCheckpointMaintenance<T> {
  applicationId?: string;
  clientId?: string | number;
  onboardingId?: number;
  sectionId: string[] | string;
  data: T;
  accountId: string | number;
  advisorId: string;
}


export type Checkpoint<T> = CustomerCheckpoint<T>;
export type CheckpointMaintenance<T> = CustomerCheckpointMaintenance<T>;

