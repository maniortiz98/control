export interface CustomerIdentificationType {
  type: string;
  text: string;
  client: string;
  spras: string;
}

export interface CustomerIdentificationTypeRequest {
  types: string[];
}

export interface CustomerIdentificationTypeResponse {
  status: number;
  payload: {
    errorMsg: {
      items: {
        messageType: string;
        category: string;
        code: string;
        message: string;
        shortDescription: string;
      }[]
    };
    status: number;
    identificationType: {
      item: {
          client: string;
          spras: string;
          type: string;
          text: string;
      }[];
    };
  };
  messages: string[];
}
export type IdentificationType = CustomerIdentificationType;
export type IdentificationTypeRequest = CustomerIdentificationTypeRequest;
export type IdentificationTypeResponse = CustomerIdentificationTypeResponse;

