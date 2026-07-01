export interface OtcSms {

}

export interface OtcSmsRequest {
    code?: string;
    phoneNumber: string;
    onboarding?: string;
}

export interface OtcSmsResponse {
    status: number;
    payload: {
        message: string;
    };
    messages: string[];
}
