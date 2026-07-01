export interface CustomerFielValitationResponse {
  certificateStatus: string;
  emissionDate:      string;
  maturityDate:      string;
  titularInfo:       CustomerTitularInfo;
  certificate:       string;
  message:           string;
  certificateNumber: string;
}

export interface CustomerTitularInfo {
  companyName:  string;
  titularName:  string;
  name:         string;
  countryISO:   string;
  rfc:          string;
  serialNumber: string;
}

export interface CustomerFielValidationRequest {
  certificateNumber: string;
}


export type FielValitationResponse = CustomerFielValitationResponse;
export type TitularInfo = CustomerTitularInfo;
export type FielValidationRequest = CustomerFielValidationRequest;

