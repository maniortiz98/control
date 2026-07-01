export interface OtcMailRequest {
  // from: string;
  // to: string[];
  // subject: string;
  // body: string;
  // bodyType: string;

  code?: string;
  email: string;
  onboarding?: string;
}

export interface OtcMailResponse {
  status: number;
  payload: {
    message: string;
    id: number;
  };
  messages: string[];
}
