export interface CurpValidationResponse {
  status: number;
  messages: string[];
  payload: CurpPayload;
}

export interface CurpPayload {
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

export interface CurpValidationRequest {
  curp: string
}