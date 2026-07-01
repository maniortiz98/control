export interface CustomerCurpValidationResponse {
  status: number;
  messages: string[];
  payload: CustomerCurpPayload;
}

export interface CustomerCurpPayload {
  result: boolean;
  renapoResponse: boolean;
  intents: number;
  curp: string | null;
  names: string | null;
  lastName: string | null;
  secondLastName: string | null;
  gender: string | null;
  birthDate: string | null;
  birthStateCode: string | null;
  birthState: string | null;
}

export interface CustomerCurpValidationRequest {
  curp: string
}
export type CurpValidationResponse = CustomerCurpValidationResponse;
export type CurpPayload = CustomerCurpPayload;
export type CurpValidationRequest = CustomerCurpValidationRequest;

