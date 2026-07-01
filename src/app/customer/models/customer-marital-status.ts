export interface CustomerMaritalStatus {
   maritalStatusId: string,
   maritalStatus: string;
   client?: string;
}

export interface CustomerMaritalStatusRequest {
  maritalStatusIds: string[];
}

export interface CustomerMaritalStatusResponse {
  status: number;
  payload: {
    errorMsg: {
      items: any;
    },
    status: number;
    maritalStatus: {
      item: CustomerMaritalStatus[];
    }
  };
  messages: string[];
}

export type MaritalStatus = CustomerMaritalStatus;
export type MaritalStatusRequest = CustomerMaritalStatusRequest;
export type MaritalStatusResponse = CustomerMaritalStatusResponse;

