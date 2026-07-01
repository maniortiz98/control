import { Address } from "./address";
import { DataClient } from "./client-data";
import { PhoneItem } from "./phone-item";

export interface AuthorizedPersonCatalog {
  authorizedPersonId: string;
  authorizedPerson: string;
}

export interface AuthorizedPersonRequest {
  authorizedPersonsIds: string[];
}

export interface AuthorizedPersonPageData {
  data: AuthorizedPerson[];
  table: AuthorizedPersonTableData[];
}

export interface AuthorizedPerson {
  id              : number | null;
  // customerNumber  : number | null; // TODO func. 3ro relacionado.
  personId        : number | null;
  active          : boolean;
  tempId?         : string;
  clientData      : DataClient;
  addressData     : Address;
  contactData?    : PhoneItem;
  authorizedPerson: AuthorizedPersonForm;
}

// Interface used on form, excluding reusable components.
export interface AuthorizedPersonForm {
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
  faculty: any;
  otherFaculty: any;
};

// Interface used on table data shown on Authorized Persona Page - Onboarding.
export interface AuthorizedPersonTableData {
  tempId?: string;
  clientNumber: string; // customerNumber: number, // TODO func. 3ro relacionado.
  id?: number | null;
  rfc: string;
  address: string;
  telephone: string;
  privileges: string;
  active?: boolean;
};
