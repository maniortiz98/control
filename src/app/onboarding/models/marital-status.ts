export interface MaritalStatus {
   maritalStatusId: string,
   maritalStatus: string;
   client?: string;
}

export interface MaritalStatusRequest {
  maritalStatusIds: string[];
}

export interface MaritalStatusResponse {
  status: number;
  payload: {
    errorMsg: {
      items: any;
    },
    status: number;
    maritalStatus: {
      item: MaritalStatus[];
    }
  };
  messages: string[];
}
