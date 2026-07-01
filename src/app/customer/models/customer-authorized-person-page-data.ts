import { CustomerAddress } from "./customer-address";
import { DataClient } from './customer-client-data';
import { CustomerPhoneItem } from './customer-phone-item';

export interface CustomerAuthorizedPersonCatalog {
  authorizedPersonId: string;
  authorizedPerson: string;
}

export interface CustomerAuthorizedPersonRequest {
  authorizedPersonsIds: string[];
}

export interface CustomerAuthorizedPersonPageData {
  data: CustomerAuthorizedPerson[];
  table: CustomerAuthorizedPersonTableData[];
}

export interface CustomerAuthorizedPerson {
  id              : number | null;
  // customerNumber  : number | null; // TODO func. 3ro relacionado.
  personId        : number | null;
  active          : boolean;
  tempId?         : string;
  clientData      : DataClient;
  addressData     : CustomerAddress;
  contactData?    : CustomerPhoneItem;
  authorizedPerson: CustomerAuthorizedPersonForm;
}

// Interface used on form, excluding reusable components.
export interface CustomerAuthorizedPersonForm {
  // customerNumber: any, // TODO func. 3ro relacionado.
  signClass: any;
  management: any;
  relationship: any;

  authorizedPerson: any;
  economicActivity: any;
  occupation: any;
  profession: any;
  workCompany: any;
  jobTitle: any;

  personPpeId?: number | null | any;
  isPpe: any;
  ppeType: any
  ppeRol: any;
  ppeExpires: any;
  ppeHasFamily: any;

  email: any;

  facultiesId?: number | null | any;
  faculties: any;
  otherFaculty: any;
};

// Interface used on table data shown on Authorized Persona Page - Onboarding.
export interface CustomerAuthorizedPersonTableData {
  tempId?: string;
  clientNumber: string; // customerNumber: number, // TODO func. 3ro relacionado.
  id?: number | null;
  rfc: string;
  address: string;
  telephone: string;
  privileges: string;
  active?: boolean;
};



export type AuthorizedPersonCatalog = CustomerAuthorizedPersonCatalog;
export type AuthorizedPersonRequest = CustomerAuthorizedPersonRequest;
export type AuthorizedPersonPageData = CustomerAuthorizedPersonPageData;
export type AuthorizedPerson = CustomerAuthorizedPerson;
export type AuthorizedPersonForm = CustomerAuthorizedPersonForm;
export type AuthorizedPersonTableData = CustomerAuthorizedPersonTableData;





