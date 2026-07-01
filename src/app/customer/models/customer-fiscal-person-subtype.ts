export interface CustomerFiscalPersonSubType {
  fiscalSubPersonTypeId: number;
  fiscalSubPersonTypeCode: string;
  fiscalSubPersonType: string;
  active: string | boolean;
  created: string;
  modified: string | null;
}

export interface CustomerFiscalPersonSubTypeRequest {
  land: string[];
}

export type FiscalPersonSubType = CustomerFiscalPersonSubType;
export type FiscalPersonSubTypeRequest = CustomerFiscalPersonSubTypeRequest;

