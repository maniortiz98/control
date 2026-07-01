import { FormControl } from "@angular/forms";
import { Address } from "../address";

export interface BeneficiariesPMPageData {
    data: BeneficiariesPM[];
    table: BeneficiariesPMTableData[];
}

export interface BeneficiariesPMTableData {
  tempId: string;
  companyName: string;
  rfc: string;
  percentage: string;
  zipcode: string;
}

export interface BeneficiariesPM {
  tempId: string;
  companyName: string;
  id: string;
  typeId: string;
  economicActivity: string;
  creationDate: string;
  percentage: string,
  address: Address|null;
}

export interface BeneficiariesPMForm {
  companyName: FormControl<string>;
  id: FormControl<string>;
  typeId: FormControl<string>;
  economicActivity: FormControl<string>;
  creationDate: FormControl<string>;
  percentage: FormControl<string>;
}
