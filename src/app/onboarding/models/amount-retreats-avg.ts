export interface AmountRetreatsAvg {
    rangeId: string;
    description: string;
}

export interface AmountRetreatsAvgRequest {
    full: boolean;
    rangeId: string;
}

export interface AmountRetreatsAvgResponse {
    status: string;
    messages: string[];
    payload: {
        ranges: AmountRetreatsAvg[]
    };
}