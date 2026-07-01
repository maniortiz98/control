export interface CustomerAccountType {
  bankAccountTypeId: string;
  bankAccount: string;
}

export interface CustomerAccountTypeRequest {
  accountTypeIds: string[];
}

export type AccountType = CustomerAccountType;
export type AccountTypeRequest = CustomerAccountTypeRequest;

