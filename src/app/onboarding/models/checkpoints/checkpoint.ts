import { CheckpointSections } from "./sections.type";
export interface Checkpoint<T> {
  applicationId?: string;
  clientId?: string | number;
  customerNumber?: string | number;
  onboardingId?: number;
  sectionId: string[] | string;
  data?: T;
}

export interface CheckpointMaintenance<T> {
  applicationId?: string;
  clientId?: string | number;
  onboardingId?: number;
  sectionId: string[] | string;
  data: T;
  accountId: string | number;
  advisorId: string;
}
