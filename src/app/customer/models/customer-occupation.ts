export interface CustomerOccupation {
  occupationId: string;
  occupation: string;
  shortDescription: string;
  mandt: string;
}

export interface CustomerOccupationRequest {
   ocupationIds: string[];
}

export interface CustomerOccupationResponse {
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
    occupation:{
      item: CustomerOccupation[];
    }
  };
  messages: string[];
}
export type Occupation = CustomerOccupation;
export type OccupationRequest = CustomerOccupationRequest;
export type OccupationResponse = CustomerOccupationResponse;

