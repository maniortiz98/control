export interface CustomerAccountStatement {
  accountStatementId: string;
  accountStatement: string;
}

export interface CustomerAccountStatementRequest {
  accountStatementsIds: string[];
}


export type AccountStatement = CustomerAccountStatement;
export type AccountStatementRequest = CustomerAccountStatementRequest;

