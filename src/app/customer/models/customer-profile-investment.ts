export interface CustomerProfileInvestment {
  profileInvestmentId: string,
  profileInvestment: string,
}

export interface CustomerProfileInvestmentRequest {
  profileInvestmentIds: string[],
}

export type ProfileInvestment = CustomerProfileInvestment;
export type ProfileInvestmentRequest = CustomerProfileInvestmentRequest;

