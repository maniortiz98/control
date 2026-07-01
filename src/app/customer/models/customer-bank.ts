export interface CustomerBank {
  bankId: string;
  bankName: string;
  bankCountry: string;
}

export interface CustomerBankRequest {
  country: string;
}

export type Bank = CustomerBank;
export type BankRequest = CustomerBankRequest;

