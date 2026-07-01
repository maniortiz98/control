export interface Occupation {
  occupationId: string;
  occupation: string;
  shortDescription: string;
  mandt: string;
}

export interface OccupationRequest {
   ocupationIds: string[];
}

export interface OccupationResponse {
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
      item: Occupation[];
    }
  };
  messages: string[];
}