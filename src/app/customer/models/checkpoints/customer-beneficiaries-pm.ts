import { FormControl } from "@angular/forms";
import { CustomerAddress } from "../customer-address";

export interface CustomerBeneficiariesPMPageData {
    data: CustomerBeneficiariesPM[];
    table: CustomerBeneficiariesPMTableData[];
}

export interface CustomerBeneficiariesPMTableData {
  tempId: string;
  companyName: string;
  rfc: string;
  percentage: string;
  zipcode: string;
}

export interface CustomerBeneficiariesPM {
  tempId: string;
  companyName: string;
  id: string;
  typeId: string;
  economicActivity: string;
  creationDate: string;
  percentage: string,
  address: CustomerAddress|null;
}

export interface CustomerBeneficiariesPMForm {
  companyName: FormControl<string>;
  id: FormControl<string>;
  typeId: FormControl<string>;
  economicActivity: FormControl<string>;
  creationDate: FormControl<string>;
  percentage: FormControl<string>;
}



export type BeneficiariesPMPageData = CustomerBeneficiariesPMPageData;
export type BeneficiariesPMTableData = CustomerBeneficiariesPMTableData;
export type BeneficiariesPM = CustomerBeneficiariesPM;
export type BeneficiariesPMForm = CustomerBeneficiariesPMForm;





