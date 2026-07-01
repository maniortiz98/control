export interface PhoneType {
  mandt: string;
  spras: string;
  telephoneTypeId: string;
  telephoneType: string;
}

export interface PhoneTypeRequest {
  telephoneTypeIds: string[];
}

export interface PhoneTypeResponse {
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
      item: PhoneType[];
    }
  };
  messages: string[];
}
