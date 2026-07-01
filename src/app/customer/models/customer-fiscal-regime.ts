export interface CustomerFiscalRegimes {
  fiscalRegimeId: string;
  description: string;
  pfApply: boolean;
  pmApply: boolean;
}

export interface CustomerFiscalRegimeRequest {
  personType: string;
}

export interface CustomerFiscalRegimeResponse {
  status: number;
  payload: {
    errorMsg: {
      items: {
        messageType: string;
        category: string;
        code: string;
        message: string;
        shortDescription: string;
      }[];
    };
    status: number;
    fiscalRegime: {
      item: CustomerFiscalRegimes[];
    };
   };
   messages: string[];
}

export type FiscalRegimes = CustomerFiscalRegimes;
export type FiscalRegimeRequest = CustomerFiscalRegimeRequest;
export type FiscalRegimeResponse = CustomerFiscalRegimeResponse;

