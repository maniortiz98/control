
export interface CustomerPaymentPeriod {
  paymentPeriodCve: string,
  paymentPeriod: string
}

export type CustomerPaymentPeriodRequest = Record<never, never>;


export type PaymentPeriod = CustomerPaymentPeriod;
export type PaymentPeriodRequest = CustomerPaymentPeriodRequest;

