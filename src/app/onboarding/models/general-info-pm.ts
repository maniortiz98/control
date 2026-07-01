export interface TransactionalResource{
  type: string;
  text?: string;
  percentage: string;
  id: number | string | null;
  active?: boolean;
}

export interface ConstitutiveDocuments{
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
