import { Moment } from 'moment';
import { CustomerAddress } from './customer-address';
import { CustomerEconomicDependents } from './customer-economic-dependents';
import { CustomerPositionHeld } from './customer-position-held';
import { CustomerSocietiesAndAssociations } from './customer-societies-and-associations';
import { convertDate } from '../../shared/utils/datetime';
import { CustomerNewContract } from './customer-initial-data';

export interface DataClient extends CustomerMinDataClient {
  ppe: boolean;
  bankAreaTypeId: string;
  contraTypeId: string;
  typeContractSubtypeId: string;
}

export interface CustomerMinDataClient extends CustomerFullNameClient {
  curp: string;
  foreignerWithoutCurp: boolean;
  typeIden: string;
  rfc: string;
  dateOfBirth: string;
  gender?: string;
  maritalStatus?: string;
  nationality: string;
  countryOfBirth: string;
  stateOfBirth: string;
  cityOfBirth?: string;
  isSaved?: boolean;
  isView?: boolean;
}

export interface CustomerFullNameClient {
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
}

export interface CustomerClient extends CustomerNewContract {
  curp?: string;
  foreignerWithoutCurp?: boolean;
  rfc?: string;
  nif?: string;
  nss?: string;
  tin?: string;
  firstName?: string;
  middleName?: string;
  dateOfBirth?: string;
  firstLastName?: string;
  secondLastName?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  countryOfBirth?: string;
  stateOfBirth?: string;
  cityOfBirth?: string;
  ppe?: boolean;
  typeIden?: string;

  typeId?: string;
  numId?: string;
  customerNumber?: string;
  idProspect?: string;
  applicationDate?: string;
  [key: string]: string | number | undefined | boolean;
}

export interface DataClient2FamilyPPE extends CustomerMinDataClient, CustomerPositionHeld {
  idS?: string; // id generado para front
  id?: number,
  personId?: number,
  accountRole?: number,
  isActive?: boolean,
  addressId?: number,
}

export interface DataClient3DepPPE extends CustomerMinDataClient, CustomerEconomicDependents, CustomerAddress {
  idS?: string; // id generado para front
  idDep?: number, // Correstponde al campo id de CustomerEconomicDependent de la respuesta
  personId?: number,
  phoneId?: number,
  accountRoleId?: number,
  isActive?: boolean,
  addressId?: number,
  clientIdNum?:number | null,
}

export interface DataClient4SocAndAssoPPE extends CustomerSocietiesAndAssociations, CustomerAddress {
  isSaved?: boolean;
  isView?: boolean;
  idS?: string; // id generado para front
  idAso?: number, // Correstponde al campo id de CustomerAssociation de la respuesta
  personId?: number,
  phoneId?: number,
  isActive?: boolean,
  addressId?: number,
  clientIdNum?:number | null,
}

export interface DataClient5PPE {
  id?: number,
  idS?: string; // id generado para front
  ppe: boolean;
  fppe: string;
  dppe: string;
  sappe: string;
  typePPE?: string;
  positionHeld?: string;
  expirationDate?: string;
  dataClientFamilyPPE: Array<DataClientFamilyPPE>;
  dataClientDepPPE: Array<DataClientDepPPE>;
  dataClientSocAndAssoPPE: Array<DataClientSocAndAssoPPE>;
}

export interface DataClient6Addres {
  addressList: Array<CustomerAddress>;
}

export function mapClientToDataClient(client: CustomerClient): DataClient {
  return {
    // CustomerMinDataClient
    curp: client.curp ?? '',
    foreignerWithoutCurp: client.foreignerWithoutCurp ?? false,
    typeIden: client.typeId ?? '',
    rfc: client.rfc ?? '',
    firstName: client.firstName ?? '',
    middleName: client.middleName ?? '',
    dateOfBirth: client.dateOfBirth ?? '',
    firstLastName: client.firstLastName ?? '',
    secondLastName: client.secondLastName ?? '',
    gender: client.gender,
    maritalStatus: client.maritalStatus,
    nationality: client.nationality ?? '',
    countryOfBirth: client.countryOfBirth ?? '',
    stateOfBirth: client.stateOfBirth ?? '',
    cityOfBirth: client.cityOfBirth,

    // DataClient
    ppe: client.ppe ?? false,
    bankAreaTypeId: client.bankAreaTypeId?.toString() ?? '',
    contraTypeId: client.contractTypeId?.toString() ?? '',
    typeContractSubtypeId: client.typeContractSubtypeId?.toString() ?? '',
  };
}
export type MinDataClient = CustomerMinDataClient;
export type FullNameClient = CustomerFullNameClient;
export type Client = CustomerClient;
export type DataClientFamilyPPE = DataClient2FamilyPPE;
export type DataClientDepPPE = DataClient3DepPPE;
export type DataClientSocAndAssoPPE = DataClient4SocAndAssoPPE;
export type DataClientPPE = DataClient5PPE;
export type DataClientAddres = DataClient6Addres;







