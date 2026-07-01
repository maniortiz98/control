export interface IdentificationType {
  type: string;
  text: string;
  client: string;
  spras: string;
}

export interface IdentificationTypeRequest {
  types: string[];
}

export interface IdentificationTypeResponse {
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