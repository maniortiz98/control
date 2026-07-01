export interface MonthlyDeposit {
  code: string;
  operationsRange: string;
  active: boolean;
  created: string;        
  modified: string | null;
}

export interface AmountMonthlyDeposit {
  code: string;
  amountRange: string;
  active: boolean;
  created: string;        
  modified: string | null;
}

export interface MonthlyDepositRequest {
}

export interface AmountMonthlyDepositRequest {
}

export type MonthlyDepositResponse = MonthlyDeposit[];
export type AmountMonthlyDepositResponse = AmountMonthlyDeposit[];
