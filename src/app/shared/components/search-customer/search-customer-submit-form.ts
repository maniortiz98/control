import { FullNameClient } from "../../../onboarding/models/client-data";

export interface SearchForm extends FullNameClient {
  customerNumber?: any;
  idProspect?: any;
  applicationDate?: any;
  curp: any;
  typeId: any;
  numId: any;
  birthdate: any;
}

export interface SearchCustomerSubmitForm {
    data: SearchForm;
    type: string;
    valid1: number;
    valid2: number;
    valid3: number;
    valid4: number;

    valid: boolean;
    empty: boolean;
    groupError: boolean;

    results?: any;
};
