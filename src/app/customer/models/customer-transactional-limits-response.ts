export interface CustomerTransactionalLimitsResponse {
  transactionalLimitId: number;
  transactionalLimitCode: string;
  transactionalLimit: string;
  active: string;
  created: string;
  modified: null;
}

export type TransactionalLimitsResponse = CustomerTransactionalLimitsResponse;

