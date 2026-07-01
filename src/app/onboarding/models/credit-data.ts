export interface Interviewee {
  firstName: string;
  lastName: string;
}

export interface RegisteredOfficersTableData {
  tempId?: string;
  firstName: string;
  middleName?: string;
  firstSurname?: string;
  secondSurname?: string;
  positionYears?: number | null;
  industryYears?: number | null;
}

export interface Officer {
  firstName: string;
  middleName?: string;
  firstSurname?: string;
  secondSurname?: string;
  nationality?: string;
  currentPosition?: string;
  positionYears?: number | null;
  industryYears?: number | null;
}
