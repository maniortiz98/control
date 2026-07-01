export interface CustomerOtcValidate {
    otc: string;
    type: string;
}

export interface CustomerOtcValidateSmsRequest extends CustomerOtcValidate {
    phoneNumber: string;
}

export interface CustomerOtcValidateEmailRequest extends CustomerOtcValidate {
    email: string;
}

export interface CustomerOtcValidateSms {
    result: string;
    intents: number;
    investmentClientFlag: boolean;
    clientProspectId: string|null;
}

export interface CustomerOtcValidateEmail {
    result: string;
    intents: number;
    investmentClientFlag: boolean;
    clientProspectId: string|null;
    accessKey: string|null;
}

export interface CustomerOtcValidateSmsResponse {
    status: number;
    payload: CustomerOtcValidateSms;
    messages: string[];
}


export interface CustomerOtcValidateEmailResponse {
   status: number;
   payload: CustomerOtcValidateEmail;
   messages: string[];
}

export type OtcValidate = CustomerOtcValidate;
export type OtcValidateSmsRequest = CustomerOtcValidateSmsRequest;
export type OtcValidateEmailRequest = CustomerOtcValidateEmailRequest;
export type OtcValidateSms = CustomerOtcValidateSms;
export type OtcValidateEmail = CustomerOtcValidateEmail;
export type OtcValidateSmsResponse = CustomerOtcValidateSmsResponse;
export type OtcValidateEmailResponse = CustomerOtcValidateEmailResponse;

