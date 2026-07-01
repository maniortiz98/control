export interface CustomerTransactionalResource{
  type: string;
  text?: string;
  percentage: string;
  id: number | string | null;
  active?: boolean;
}

export interface CustomerConstitutiveDocuments{
  documentType: string;
  deedNumber: string;
  deedDate: string;
  notaryNumber: string;
  notaryName: string;
  protocolSquare: string;
  inscriptionDate: string;
  govermentContract: string;
  publicFolio: string;
}



export type TransactionalResource = CustomerTransactionalResource;
export type ConstitutiveDocuments = CustomerConstitutiveDocuments;

