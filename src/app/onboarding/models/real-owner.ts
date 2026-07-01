import { PositionHeld } from './position-held';

export interface RealOwner {
  id?: number;
  personId?: number;
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

export interface RealOwnerData {
  generalData: RealOwner;
  ppe: RealOwnerPPE;
  adrres: Address;
}

export interface Address {
  id?: string | number,
  addressId?: number,
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
  active?: boolean,
}
export interface RealOwnerPPE {
  idM?: number;
  id?: number;
  ppe: boolean;
  tppe: string;
  positionHeld: string;
  expirationDate: string;
  fppe: boolean;
  dataFamily: Array<DataRealOwnerClientFamilyPPESave>;
}

export interface DataRealOwnerClientFamilyPPE
  extends MinRealOwnerDataClient,
  PositionHeld {
  idM?: number;
  id?: string | number;
  idS?: string;
  accountRoleId?: number;
  active?: boolean;
  personId?: number;
  isView?: boolean;
  isSaved?: boolean;
}

interface DataRealOwnerClientFamilyPPESave
  extends MinRealOwnerDataClient,
  PositionHeld {
  idM?: number;
  id?: string | number;
  idS?: string;
  personId?: number;
  active?: boolean;
  accountRoleId?: number;
  isView?: boolean;
  isSaved?: boolean;
}
export interface MinRealOwnerDataClient {
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
export interface RealOwnerPersonType {
  desPersonType: string;
  personTypeId: string;
}

export interface FinancialEntity {
  id: string;
  description: string;
}

export interface AccionariaEstructura {
  personTypeId: string;
  desPersonType: string;
}

export interface ShareholderTablePF {
  tempId?: string;
  fullName: string;
  email: string;
  phone: number;
  country: string;
  participation: string;
}

export const ACCIONARIA_ESTRUCTURAS: AccionariaEstructura[] = [
  {
    personTypeId: '1',
    desPersonType: 'Estructura Accionaria PF en Accionistas',
  },
  {
    personTypeId: '2',
    desPersonType: 'Estructura Accionaria PM en Accionistas',
  },
  {
    personTypeId: '3',
    desPersonType: 'Estructura Accionaria PF y PM en Accionistas',
  },
  { personTypeId: '4', desPersonType: 'PM con Fideicomiso en Accionistas' },
  { personTypeId: '5', desPersonType: 'PM con Accionistas que Cotizan en BMV' },
];

export const FINANCIAL_ENTITIES: FinancialEntity[] = [
  { id: '1', description: 'Sociedades Controladoras de Grupos Financieros' },
  { id: '2', description: 'Sociedades de Inversión' },
  {
    id: '3',
    description:
      'Sociedades de Inversión Especializadas en Fondos para el Retiro',
  },
  { id: '4', description: 'Sociedades Operadoras de Sociedades de Inversión' },
  {
    id: '5',
    description:
      'Sociedades Distribuidoras de Acciones de Sociedades de Inversión',
  },
  { id: '6', description: 'Instituciones de Crédito' },
  { id: '7', description: 'Casas de Bolsa' },
  { id: '8', description: 'Casas de Cambio' },
  { id: '9', description: 'Administradoras de Fondos para el Retiro' },
  { id: '10', description: 'Instituciones de Seguros' },
  { id: '11', description: 'Sociedades Mutualistas de Seguros' },
  { id: '12', description: 'Instituciones de Fianzas' },
  { id: '13', description: 'Almacenes Generales de Depósito' },
  { id: '14', description: 'Financieras de Objeto Limitado' },
  { id: '15', description: 'Arrendadoras Financieras' },
  { id: '16', description: 'Sociedades Cooperativas de Ahorro y Préstamo' },
  { id: '17', description: 'Sociedades Financieras Populares' },
  { id: '18', description: 'Uniones de Crédito' },
  { id: '19', description: 'Empresas de Factoraje Financiero' },
  { id: '20', description: 'Sociedades Emisoras de Valores' },
  { id: '21', description: 'Entidades Financieras del Exterior' },
  {
    id: '22',
    description:
      'Dependencias y Entidades públicas federales, estatales y municipales',
  },
  { id: '23', description: 'Bolsas de Valores' },
  { id: '24', description: 'Instituciones para el Depósito de Valores' },
  {
    id: '25',
    description:
      'Empresas que administren mecanismos para facilitar las transacciones con valores',
  },
  { id: '26', description: 'Contrapartes Centrales' },
];

export const REAL_OWNER_PERSON_TYPES: RealOwnerPersonType[] = [
  { desPersonType: 'Sociedad civiles', personTypeId: '1' },
  { desPersonType: 'Sociedad civil (s.c)', personTypeId: '2' },
  { desPersonType: 'Asociación civil (a.c)', personTypeId: '3' },
  { desPersonType: 'Asociación cooperativa', personTypeId: '4' },
  { desPersonType: 'Asociaciones religiosas', personTypeId: '5' },
  { desPersonType: 'Fundaciones', personTypeId: '6' },
  { desPersonType: 'Sindicatos', personTypeId: '7' },
  { desPersonType: 'Municipios', personTypeId: '8' },
  { desPersonType: 'Entidades del régimen simplificado', personTypeId: '9' },
  {
    desPersonType: 'Gubernamentales sujetas a la cuenta única',
    personTypeId: '10',
  },
  { desPersonType: 'Otros', personTypeId: '11' },
];

export interface ShareholderFormData {
  personType: 'PF' | 'PM';
  participation: number;
  curp?: string;
  rfc?: string;
  keyFiscalCountry?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  birthDate?: string;
  gender?: string;
  nationality: string;
  birthCountry: string;
  birthEntity: string;
  politicallyExposed: 'YES' | 'NO';
  position?: string;
  positionDate?: string;
  countryResidence: string;
  postalCode?: string;
  state?: string;
  city?: string;
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  phone: string;
  email: string;
  table?: {
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    email: string;
    phone: number;
    country: string;
    participation: string;
  }
}
