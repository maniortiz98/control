export interface CustomerMarriageType {
  mandt: string;
  marriageTypeId: string;
  marriageType: string;
}

export interface CustomerMarriageTypeRequest {
  marriageTypeIds: string[];
}
export interface CustomerMarriageTypeResponse {
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
      item: CustomerMarriageType[];
    };
  };
  messages: string[];
}

export type MarriageType = CustomerMarriageType;
export type MarriageTypeRequest = CustomerMarriageTypeRequest;
export type MarriageTypeResponse = CustomerMarriageTypeResponse;

