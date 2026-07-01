
export interface CustomerRiskGroup {
  riskGroupCve: string,
  riskGroup: string
}

export type CustomerRiskGroupRequest = Record<never, never>;


export type RiskGroup = CustomerRiskGroup;
export type RiskGroupRequest = CustomerRiskGroupRequest;

