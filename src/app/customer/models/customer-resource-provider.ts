import { CustomerPositionHeld } from './customer-position-held';


export interface CustomerResourceProvider {
  accountRoleId?: number; // Campo nuevo
  active?: boolean; // Campo nuevo

  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  firstLastName: string;
  secondLastName: string;
  gender: string;
  maritalStatus?: string;
  nationality: string;
  countryOfBirth: string;
  stateOfBirth: string;
  countryTaxCodeAbroad?: string;
  typeIden: string;
  typePerson?: string;
  relationship: string;
  field: string;
  phone: string;
  mail: string;
  economicActivity: string;
  expirationDateField: string;
}

export interface CustomerResourceProviderData {
  generalData: CustomerResourceProvider,
  ppe: CustomerResourceProviderPPE,
  adrres: CustomerAddress,
}
export interface CustomerResourceProviderPPE {
  active?: boolean; // Campo nuevo
  personPpeId?: number; // Campo nuevo
  ppe: boolean;
  tppe: string;
  positionHeld: string;
  expirationDate: string;
  fppe: boolean;
  dataFamily: Array<DataResourceProviderClientFamilyPPESave>;
}

interface DataResourceProviderClientFamilyPPESave extends CustomerMinResourceProviderDataClient, CustomerPositionHeld {
  city?: string ; // Campo nuevo
  idS?: string; // Campo Nuevo solo para uso en front
  isView?: boolean;
  isSaved?: boolean;

   //Aqui faltan dos campos active y id de back para la eliminacion logica
   accountRoleId?: number; // Campo mock para logica solo remplazar nombre
  active?: boolean; // Campo mock para logica solo remplazar nombre
}
export interface CustomerMinResourceProviderDataClient {
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  firstLastName: string;
  secondLastName: string;
  nationality: string;
  countryOfBirth: string;
  countryTaxCodeAbroad?: string;
  typeIden: string;
}

export interface CustomerAddress {
  addressId?: number ; // Campo nuevo
  addressAccountId?: number,
  addressRole?: string,
  addressType: string,
  other?: string,
  country: string,
  postalCode: string,
  federalEntity: string,
  city: string,
  municipality: string,
  neighborhood: string,
  street: string,
  externalNumber: string,
  internalNumber?: string,
  confirmCp?: string,
  timeLiveMexico?: string,
  reasonsOpeningContractMexico?: string,
  proofOfAddressType?: string,
  addressProofIssueDate?: string,
  expirationYear?: string,
  taxPostalCode?: string,
  geographicalArea?: string,
  deliveryCenter?: string,
  neighborhoodName?: string,
  addressConcatenation?: string,
  federalEntityID?: string,
  cityID?: string,
  municipalityID?: string,
  isSaved?: boolean,
  isView?: boolean,
}



export type ResourceProvider = CustomerResourceProvider;
export type ResourceProviderData = CustomerResourceProviderData;
export type ResourceProviderPPE = CustomerResourceProviderPPE;
export type MinResourceProviderDataClient = CustomerMinResourceProviderDataClient;
export type Address = CustomerAddress;


