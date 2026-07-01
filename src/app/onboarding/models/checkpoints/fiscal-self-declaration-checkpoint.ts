export interface FiscalSelfDeclaration {
  id?: number;
  mexicoResident: boolean;
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  name: string;
  fiscalRegimeId: number;
  cfdiUse: string;
  taxPostalCode: string;
  nationality: string;
  country: string;
  fiscalResidenceAbroad: boolean;
  facta: boolean;
  crs: boolean;
  fiscalResidences: FiscalResidencesData[];
}

export interface FiscalResidencesData {
  personId?: number | null;
  id?: number;
  active?: boolean;
  tempId?: string;
  personType: any;
  country: string;
  declarationFiscalResidence: boolean;
  proofOfAddressType: string;
  issueDate: string;
  expirationStatus: string;
  expirationDate: string;
  certificationDate: string;
  declarationYear: number;
  aditionalDays: string;
  factaObligations: {
    factaId?: number | null,
    id?: number;
    autentication?: string;
    nif?: string;
    tin?: string;
    nss?: string;
  };
}
