export interface CustomerCFDI {
  cfdiUsageId: string;
  description: string;
  pfApply: boolean;
  pmApply: boolean;
}

export interface CustomerCfdiRequest {
  personType: string;
	fiscalRegimeId: string;
}

export interface CustomerCfdiResponse {
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
    cfdi:{
      item: CustomerCFDI[];
    };
  };
  messages: string[];
}

export type CFDI = CustomerCFDI;
export type CfdiRequest = CustomerCfdiRequest;
export type CfdiResponse = CustomerCfdiResponse;

