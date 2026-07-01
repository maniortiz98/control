export interface CustomerFiscalPersonType {
  fiscalPersonTypeId: number;
  fiscalPersonTypeCode: string;
  fiscalPersonType: string;
  active: string | boolean;
  created: string;
  modified: string | null;
}

export interface CustomerFiscalPersonTypeRequest {
  land: string[];
}

export type FiscalPersonType = CustomerFiscalPersonType;
export type FiscalPersonTypeRequest = CustomerFiscalPersonTypeRequest;

