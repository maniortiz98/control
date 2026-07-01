import { PolicyPerRow } from "../../shared/utils/policy";

export interface FiscalSelfDeclarationPageData {
  data: FiscalSelfDeclarationForm[];
  table: FiscalSelfDeclarationTableData[];
}

export interface FiscalSelfDeclarationForm {
  personId?: number | null;
  policy?: PolicyPerRow;
  active?: boolean | null;
  registerNo?: number;
  tempId?: string;
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
  factaObligations: {
    factaId?: number | null,
    autentication?: string;
    nif?: string;
    tin?: string;
    nss?: string;
  };
}

export interface FiscalResidence {
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
  factaObligations: {
    factaId?: number,
    autentication: string;
    nif?: string;
    tin?: string;
    nss?: string;
  };
}

export interface ClientTaxData {
  id?: number;
  mexicoResident: boolean;
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  name: string;
  fiscalRegimeId: number;
  cfdiUsageId?: string;
  cfdiUse?: string;
  taxPostalCode: string;
  nationality: string;
  country: string;
  fiscalResidenceAbroad: boolean;
  crs: boolean;
  facta: boolean;
  fiscalResidences: FiscalResidence[];
}

export interface FiscalSelfDeclarationTableData {
  tempId?: string;
  active?: boolean | null;
  personId?: number | null;
  registerNo: number;
  personType: number;
  proofOfAddressType: string;
  autentication?: string;
  proofOfAddressFiscal?: string;
  nif?: string;
  tin?: string;
  nss?: string;

}

export interface MinFiscalData {
  taxCountry: string,
  countryBirth: string,
}

export interface FiscalValidationContext {
  countryId: string;
  nationality: string;
  taxCountry: string;
  doubleTaxCountry: string;
}

export type CustomerFiscalSelfDeclarationPageData = FiscalSelfDeclarationPageData;
export type CustomerFiscalSelfDeclarationForm = FiscalSelfDeclarationForm;
export type CustomerFiscalResidence = FiscalResidence;
export type CustomerClientTaxData = ClientTaxData;
export type CustomerFiscalSelfDeclarationTableData = FiscalSelfDeclarationTableData;
export type CustomerMinFiscalData = MinFiscalData;
export type CustomerFiscalValidationContext = FiscalValidationContext;



