export interface CustomerPhoneType {
  mandt: string;
  spras: string;
  telephoneTypeId: string;
  telephoneType: string;
}

export interface CustomerPhoneTypeRequest {
  telephoneTypeIds: string[];
}

export interface CustomerPhoneTypeResponse {
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
    telephoneType:{
      item: CustomerPhoneType[];
    }
  };
  messages: string[];
}

export type PhoneType = CustomerPhoneType;
export type PhoneTypeRequest = CustomerPhoneTypeRequest;
export type PhoneTypeResponse = CustomerPhoneTypeResponse;

