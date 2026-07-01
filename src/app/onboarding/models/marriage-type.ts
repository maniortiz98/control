export interface MarriageType {
  mandt: string;
  marriageTypeId: string;
  marriageType: string;
}

export interface MarriageTypeRequest {
  marriageTypeIds: string[];
}
export interface MarriageTypeResponse {
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
    marriageType: {
      item: MarriageType[];
    };
  };
  messages: string[];
}
