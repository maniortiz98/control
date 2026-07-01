import { CustomerFullNameClient } from '../../models/customer-client-data';

export interface CustomerSearchForm extends CustomerFullNameClient {
  customerNumber?: any;
  idProspect?: any;
  applicationDate?: any;
  curp: any;
  typeId: any;
  numId: any;
  birthdate: any;
}

export interface CustomerSearchCustomerSubmitForm {
    data: CustomerSearchForm;
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

