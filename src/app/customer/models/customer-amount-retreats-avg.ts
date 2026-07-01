export interface CustomerAmountRetreatsAvg {
    rangeId: string;
    description: string;
}

export interface CustomerAmountRetreatsAvgRequest {
    full: boolean;
    rangeId: string;
}

export interface CustomerAmountRetreatsAvgResponse {
    status: string;
    messages: string[];
    payload: {
        ranges: CustomerAmountRetreatsAvg[]
    };
}
export type AmountRetreatsAvg = CustomerAmountRetreatsAvg;
export type AmountRetreatsAvgRequest = CustomerAmountRetreatsAvgRequest;
export type AmountRetreatsAvgResponse = CustomerAmountRetreatsAvgResponse;

