export interface FielValitationResponse {
  certificateStatus: string;
  emissionDate:      string;
  maturityDate:      string;
  titularInfo:       TitularInfo;
  certificate:       string;
  message:           string;
  certificateNumber: string;
}

export interface TitularInfo {
  companyName:  string;
  titularName:  string;
  name:         string;
  countryISO:   string;
  rfc:          string;
  serialNumber: string;
}

export interface FielValidationRequest {
  certificateNumber: string;
}

