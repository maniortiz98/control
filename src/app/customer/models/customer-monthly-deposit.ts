export interface CustomerMonthlyDeposit {
  code: string;
  operationsRange: string;
  active: boolean;
  created: string;        
  modified: string | null;
}

export interface CustomerAmountMonthlyDeposit {
  code: string;
  amountRange: string;
  active: boolean;
  created: string;        
  modified: string | null;
}

export interface CustomerMonthlyDepositRequest {
}

export interface CustomerAmountMonthlyDepositRequest {
}

export type CustomerMonthlyDepositResponse = CustomerMonthlyDeposit[];
export type CustomerAmountMonthlyDepositResponse = CustomerAmountMonthlyDeposit[];



export type MonthlyDeposit = CustomerMonthlyDeposit;
export type AmountMonthlyDeposit = CustomerAmountMonthlyDeposit;
export type MonthlyDepositRequest = CustomerMonthlyDepositRequest;
export type AmountMonthlyDepositRequest = CustomerAmountMonthlyDepositRequest;
export type MonthlyDepositResponse = CustomerMonthlyDepositResponse;
export type AmountMonthlyDepositResponse = CustomerAmountMonthlyDepositResponse;

