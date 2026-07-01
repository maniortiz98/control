import { FormControl } from "@angular/forms";

export interface CustomerBankAccountForm {
  accountType: any;
  currency: any;
  domiciled: any;
  accountStatus: FormControl<string>;
  maxAmount: any;
  bank: any;
  alias: any;
  checkThird: any;
  checkDocument: any;
  checkPayment: any;
  addressee1: any;
  addressee1Account: any;
  addressee1Clabe: any;
  addressee2: any;
  addressee2Account: any;
  addressee2Clabe: any;
  addressee3?: any; /* shown in CustomerMaintenance */
  addressee3Account?: any; /* shown in CustomerMaintenance */
  addressee3Clabe?: any; /* shown in CustomerMaintenance */
  reference: any;
  concept: any;
  intermediaryBank: any;
  subAccount: any;
  subAccountId: any;
  temporality: any; /* shown in CustomerMaintenance */
}
export type BankAccountForm = CustomerBankAccountForm;

