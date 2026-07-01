import { Moment } from 'moment';
import { Address } from './address';
import { EconomicDependents } from "./economic-dependents";
import { PositionHeld } from "./position-held";
import { SocietiesAndAssociations } from "./societies-and-associations";
import { convertDate } from '../../shared/utils/datetime';
import { NewContract } from './customer-initial-data';

export interface DataClient extends MinDataClient {
  ppe: boolean;
  bankAreaTypeId: string;
  contraTypeId: string;
  typeContractSubtypeId: string;
}

export interface MinDataClient extends FullNameClient {
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

export interface FullNameClient {
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
}

export interface Client extends NewContract {
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

export interface DataClientFamilyPPE extends MinDataClient, PositionHeld {
  idS?: string; // Id generado para front
  id?: number,
  personId?: number,
  accountRole?: number,
  isActive?: boolean,
  addressId?: number,
}

export interface DataClientDepPPE extends MinDataClient, EconomicDependents, Address {
  idS?: string; // Id generado para front
  idDep?: number, // Correstponde al campo id de EconomicDependent de la respuesta
  personId?: number,
  phoneId?: number,
  accountRoleId?: number,
  isActive?: boolean,
  addressId?: number,
  clientIdNum?:number | null,
}

export interface DataClientSocAndAssoPPE extends SocietiesAndAssociations, Address {
  isSaved?: boolean;
  isView?: boolean;
  idS?: string; // Id generado para front
  idAso?: number, // Correstponde al campo id de Association de la respuesta
  personId?: number,
  phoneId?: number,
  isActive?: boolean,
  addressId?: number,
  clientIdNum?:number | null,
}

export interface DataClientPPE {
  id?: number,
  idS?: string; // Id generado para front
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

export interface DataClientAddres {
  addressList: Array<Address>;
}

export function mapClientToDataClient(client: Client): DataClient {
  return {
    // MinDataClient
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
