export interface FiscalRegimes {
  fiscalRegimeId: string;
  description: string;
  pfApply: boolean;
  pmApply: boolean;
}

export interface FiscalRegimeRequest {
  personType: string;
}

export interface FiscalRegimeResponse {
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
      item: FiscalRegimes[];
    };
   };
   messages: string[];
}
