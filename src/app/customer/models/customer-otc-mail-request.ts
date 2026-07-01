export interface CustomerOtcMailRequest {
  // from: string;
  // to: string[];
  // subject: string;
  // body: string;
  // bodyType: string;

  code?: string;
  email: string;
  onboarding?: string;
}

export interface CustomerOtcMailResponse {
  status: number;
  payload: {
    message: string;
    id: number;
  };
  messages: string[];
}



export type OtcMailRequest = CustomerOtcMailRequest;
export type OtcMailResponse = CustomerOtcMailResponse;

