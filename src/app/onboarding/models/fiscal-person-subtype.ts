export interface FiscalPersonSubType {
  fiscalSubPersonTypeId: number;
  fiscalSubPersonTypeCode: string;
  fiscalSubPersonType: string;
  active: string | boolean;
  created: string;
  modified: string | null;
}

export interface FiscalPersonSubTypeRequest {
  land: string[];
}
