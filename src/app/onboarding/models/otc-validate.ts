export interface OtcValidate {
    otc: string;
    type: string;
}

export interface OtcValidateSmsRequest extends OtcValidate {
    phoneNumber: string;
}

export interface OtcValidateEmailRequest extends OtcValidate {
    email: string;
}

export interface OtcValidateSms {
    result: string;
    intents: number;
    investmentClientFlag: boolean;
    clientProspectId: string|null;
}

export interface OtcValidateEmail {
    result: string;
    intents: number;
    investmentClientFlag: boolean;
    clientProspectId: string|null;
    accessKey: string|null;
}

export interface OtcValidateSmsResponse {
    status: number;
    payload: OtcValidateSms;
    messages: string[];
}


export interface OtcValidateEmailResponse {
   status: number;
   payload: OtcValidateEmail;
   messages: string[];
}
