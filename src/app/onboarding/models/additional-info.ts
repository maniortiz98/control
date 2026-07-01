export interface ID_ADDRESS_TYPE {
  code: string;
  description: string;
}

export interface ID_EDOC {
  code: string;
  description: string;
}

export const ADDRESS_TYPE_OPTIONS: ID_ADDRESS_TYPE[] = [
  { code: '1', description: 'Casa' },
  { code: '2', description: 'Oficina' },
  { code: '3', description: 'Apartado postal' },
  { code: '4', description: 'Otro' },
];

export const DOCUMENT_DELIVERY_OPTIONS: ID_EDOC[] = [
  { code: '1', description: 'Al Cliente por Correo' },
  { code: '2', description: 'Al Cliente por Mensajería' },
  { code: '3', description: 'Al Cliente por Mensajero Especial' },
  { code: '4', description: 'Al Cliente Extranjero' },
];

export interface AdditionalInfoTableData {
  tempId?: string;
  startDateW8: string;
  endDateW8: string;
  id?: number,
  active: boolean,
}

export interface AdditionalInfoPageData {
  data: AdditionalInfoData;
  table: AdditionalInfoTableData[];
}

export interface AdditionalInfoData {
  tempId?: string;
  addressKey: string;
  sendDocuments: string;
  isrExempt: boolean;
  expirationDate: string;
  startDate: string;
  endDate: string;
  w8benForm: boolean;
  locations: string;

  currencyOperations: boolean;
  thirdPartyCompanies: boolean;
  ownCompanies: boolean;
  sicShares: boolean;
  derivativeInstruments: boolean;
  debtInstruments: boolean;
  savingsPlans: boolean;
}
