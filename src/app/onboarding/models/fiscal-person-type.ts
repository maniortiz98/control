export interface FiscalPersonType {
  fiscalPersonTypeId: number;
  fiscalPersonTypeCode: string;
  fiscalPersonType: string;
  active: string | boolean;
  created: string;
  modified: string | null;
}

export interface FiscalPersonTypeRequest {
  land: string[];
}
