import { DataClient, FullNameClient } from "../client-data";
import { Address } from "../address";

/**
 * it's the interface used to store data on section.
 * Used also to show items on table.
 */
export interface BeneficiariesCurrentTableData {
  beneficiaryId   : number | null;
  personId        : number | null;
  accountRoleId   : number | null;
  active          : boolean;
  clientData      : DataClient;
  addressData     : Address;
  firstName       : string;
  lastName        : string;
  relationShip    : string | null;
  relationShipName: string | null;
  percentage      : string | null;
  sameAddress     : boolean | null;
  tempId          : string;
};

export interface Beneficiaries {
  beneficiaries: BeneficiariesCheckpointSingle[];
};

export interface BeneficiariesCheckpointSingle extends FullNameClient {
  beneficiaryId        : number | null;
  personId             : number | null;
  accountRoleId        : number | null;
  curp                 : string;
  foreignWithoutCURP   : boolean;
  rfc                  : string;
  nif                  : string;
  tin                  : string;
  nss                  : string;
  // fields name from FullNameClient
  country              : string;
  dateOfBirth          : string;
  gender               : number;
  maritalStatus        : string;
  nationality          : string;
  federalEntity        : string;
  relationship         : number;
  beneficiaryPercentage: string;
  addrees              : Address;
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