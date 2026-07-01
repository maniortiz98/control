export interface CustomerInterviewee {
  firstName: string;
  lastName: string;
}

export interface CustomerRegisteredOfficersTableData {
  tempId?: string;
  firstName: string;
  middleName?: string;
  firstSurname?: string;
  secondSurname?: string;
  positionYears?: number | null;
  industryYears?: number | null;
}

export interface CustomerOfficer {
  firstName: string;
  middleName?: string;
  firstSurname?: string;
  secondSurname?: string;
  nationality?: string;
  currentPosition?: string;
  positionYears?: number | null;
  industryYears?: number | null;
}

export type Interviewee = CustomerInterviewee;
export type RegisteredOfficersTableData = CustomerRegisteredOfficersTableData;
export type Officer = CustomerOfficer;

