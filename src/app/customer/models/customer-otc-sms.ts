export interface CustomerOtcSms {

}

export interface CustomerOtcSmsRequest {
    code?: string;
    phoneNumber: string;
    onboarding?: string;
}

export interface CustomerOtcSmsResponse {
    status: number;
    payload: {
        message: string;
    };
    messages: string[];
}

export type OtcSms = CustomerOtcSms;
export type OtcSmsRequest = CustomerOtcSmsRequest;
export type OtcSmsResponse = CustomerOtcSmsResponse;

