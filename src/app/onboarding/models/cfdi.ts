export interface CFDI {
  cfdiUsageId: string;
  description: string;
  pfApply: boolean;
  pmApply: boolean;
}

export interface CfdiRequest {
  personType: string;
	fiscalRegimeId: string;
}

export interface CfdiResponse {
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
      item: CFDI[];
    };
  };
  messages: string[];
}
