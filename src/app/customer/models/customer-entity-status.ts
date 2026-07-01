import { CustomerCountryWithFiscalObligation } from './customer-CountryWithFiscalObligation';
import { CustomerSelectedPerson } from "./customer-person-control";

export interface CustomerEntityStatusSection {
  rfc?: string,
  nationality?: string,
  hasResidenceInMexico?: boolean,
  hasOutlaterFiscalResidence?: boolean,

  fatcaClasificationType?: string,
  fatcaClasificationText?: string,
  factaClasificationGiin?:string,
  crsClasificationType?: string,
  crsClasificationText?: string,

  fiscalResidences: CustomerCountryWithFiscalObligation[],
  selectedPersons: CustomerSelectedPerson[],
}

export type EntityStatusSection = CustomerEntityStatusSection;


