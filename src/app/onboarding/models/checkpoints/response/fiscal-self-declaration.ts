interface FactaObligations {
  autentication: string | null;
  nif: string | null;
  tin: string | null;
  nss: string | null;
}

interface FiscalResidence {
  personType: number | null;
  country: string | null;
  declarationFiscalResidence: boolean | null;
  proofOfAddressType: string | null;
  issueDate: string | null;
  expirationStatus: string | null;
  expirationDate: string | null;
  certificationDate: string | null;
  declarationYear: number | null;
  aditionalDays: string | null;
  factaObligations: FactaObligations | null;
  activeFiscalDomicilie: boolean | null;
}

export interface DataFiscalSelfDeclaration {
  mexicoResident: boolean | null;
  curp: string | null;
  foreignerWithoutCurp: boolean | null;
  rfc: string | null;
  name: string | null;
  fiscalRegimeId: number | null;
  cfdiUse: string | null;
  taxPostalCode: string | null;
  nationality: string | null;
  country: string | null;
  fiscalResidenceAbroad: boolean | null;
  facta: boolean | null;
  crs: boolean | null;
  fiscalResidences: FiscalResidence[] | null;
}
