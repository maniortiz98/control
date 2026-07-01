import { DataClient, CustomerFullNameClient } from '../customer-client-data';
import { CustomerAddress } from "../customer-address";

/**
 * it's the interface used to store data on section.
 * Used also to show items on table.
 */
export interface CustomerBeneficiariesCurrentTableData {
  beneficiaryId   : number | null;
  personId        : number | null;
  accountRoleId   : number | null;
  active          : boolean;
  clientData      : DataClient;
  addressData     : CustomerAddress;
  firstName       : string;
  lastName        : string;
  relationShip    : string | null;
  relationShipName: string | null;
  percentage      : string | null;
  sameAddress     : boolean | null;
  tempId          : string;
};

export interface CustomerBeneficiaries {
  beneficiaries: CustomerBeneficiariesCheckpointSingle[];
};

export interface CustomerBeneficiariesCheckpointSingle extends CustomerFullNameClient {
  beneficiaryId        : number | null;
  personId             : number | null;
  accountRoleId        : number | null;
  curp                 : string;
  foreignWithoutCURP   : boolean;
  rfc                  : string;
  nif                  : string;
  tin                  : string;
  nss                  : string;
  // fields name from CustomerFullNameClient
  country              : string;
  dateOfBirth          : string;
  gender               : number;
  maritalStatus        : string;
  nationality          : string;
  federalEntity        : string;
  relationship         : number;
  beneficiaryPercentage: string;
  addrees              : CustomerAddress;
  // address: {
  //   addressType: string;
  //   country: string;
  //   street: string;
  //   externalNumber: string;
  //   internalNumber: string;
  //   postalCode: string;
  //   federalEntity: string;
  //   municipality: string;
  //   neighborhood: string;
  //   city: string;
  // }
};
export type BeneficiariesCurrentTableData = CustomerBeneficiariesCurrentTableData;
export type Beneficiaries = CustomerBeneficiaries;
export type BeneficiariesCheckpointSingle = CustomerBeneficiariesCheckpointSingle;





