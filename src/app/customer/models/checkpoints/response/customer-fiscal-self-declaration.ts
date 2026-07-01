interface FactaObligations {
  factaId: number | null;
  autentication: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
}

interface CustomerFiscalResidence {
  personId?: number;
  active?: boolean; 
  personType: number;
  country: string;
  declarationFiscalResidence: boolean;
  proofOfAddressType: string;
  issueDate: string;
  expirationStatus: string;
  expirationDate: string;
  certificationDate: string;
  declarationYear: number;
  aditionalDays: string;
  factaObligations: FactaObligations;
  activeFiscalDomicilie: boolean;
}

export interface DataFiscalSelfDeclaration {
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
  fiscalResidences: CustomerFiscalResidence[];
}



