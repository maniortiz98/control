export interface CustomerInvestmentType {
  investmentTypeId: string,
  investmentType: string,
}

export interface CustomerInvestmentTypeRequest {
  investmentTypeIds: string[],
}

export type InvestmentType = CustomerInvestmentType;
export type InvestmentTypeRequest = CustomerInvestmentTypeRequest;

