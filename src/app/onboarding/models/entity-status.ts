import { CountryWithFiscalObligation } from "./CountryWithFiscalObligation";
import { SelectedPerson } from "./person-control";

export interface EntityStatusSection {
  rfc?: string,
  nationality?: string,
  hasResidenceInMexico?: boolean,
  hasOutlaterFiscalResidence?: boolean,

  fatcaClasificationType?: string,
  fatcaClasificationText?: string,
  factaClasificationGiin?:string,
  crsClasificationType?: string,
  crsClasificationText?: string,

  fiscalResidences: CountryWithFiscalObligation[],
  selectedPersons: SelectedPerson[],
}
