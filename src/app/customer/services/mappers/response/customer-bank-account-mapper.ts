import { signal } from "@angular/core";
import { HttpClientService } from "../../../../core/services/http-client.service";
import { LocalStorageService } from "../../../../core/services/local-storage.service";
import { CustomerCatalogsService } from "../../customer-catalogs.service";

import { CustomerAccountStatement } from "../../../models/customer-account-statement";
import { CustomerAccountType } from "../../../models/customer-account-type";
import { CustomerBank } from "../../../models/customer-bank";
import { CustomerCurrencyType } from "../../../models/customer-currency-type";
import { CustomerBankAccounts } from "../../../models/checkpoints/response/customer-bank-account";
interface MappedBankAccount {
  accountType: string | null;
  currency: string | null;
  domiciled: string | null;
  maxAmount: string | null;
  bank: string | null;
  alias: string | null;
  checkThird: boolean | null;
  checkDocument: boolean | null;
  checkPayment: boolean | null;
  addressee1: string | null;
  addressee1Account: string | null;
  addressee1Clabe: string | null;
  addressee2: string | null;
  addressee2Account: string | null;
  addressee2Clabe: string | null;
  reference: string | null;
  concept: string | null;
  intermediaryBank: string | null;
  subAccount: string | null;
  subAccountId: string | null;
  temporality: string | null;
  addressee1Data: object;
  addressee2Data: object;
  bankName: string | null;
  currencyName: string | null;
  accountTypeName: string | null;
  accountStatusName: string | null;
}

type MappedBankAccounts = MappedBankAccount[] | null;

export function mapBankAccounts(CustomerBankAccounts: CustomerBankAccounts): MappedBankAccounts {
  if (!CustomerBankAccounts) return null;

  return CustomerBankAccounts.map((bankAccount: any) => {
    const beneficiaries = bankAccount.beneficiaries || [];
    const addressee1 = beneficiaries[0] || { beneficiaryName: null, accountNumberIban: null, clabe: null };
    const addressee2 = beneficiaries[1] || { beneficiaryName: null, accountNumberIban: null, clabe: null };

    return {
      accountType: bankAccount.accountType,
      currency: bankAccount.currency,
      domiciled: bankAccount.domiciledIn,
      maxAmount: bankAccount.maxAmount,
      bank: bankAccount.bank,
      alias: bankAccount.alias,
      checkThird: bankAccount.isThirdParty,
      checkDocument: bankAccount.paymentMethodDocument,
      checkPayment: bankAccount.paymentMethodElectronic,
      addressee1: addressee1.beneficiaryName,
      addressee1Account: addressee1.accountNumberIban,
      addressee1Clabe: addressee1.clabe,
      addressee2: addressee2.beneficiaryName,
      addressee2Account: addressee2.accountNumberIban,
      addressee2Clabe: addressee2.clabe,
      reference: bankAccount.reference,
      concept: bankAccount.concept,
      intermediaryBank: bankAccount.intermediaryBank,
      subAccount: bankAccount.subaccountHolder,
      subAccountId: bankAccount.subaccountKey,
      temporality: "",
      addressee1Data: {},
      addressee2Data: {},
      bankName: getName('customer-bank', bankAccount.bank),
      currencyName: getName('currency', bankAccount.currency),
      accountTypeName: getName('accountType', bankAccount.accountType),
      accountStatusName: getName('accountStatus', bankAccount.accountStatus),
    };
  });
}

function getName(cat: string, id: any): string {
  let name = '';
  const localStorageService = new LocalStorageService();
  const httpClientService = new HttpClientService();
  const catalogsService: CustomerCatalogsService = new CustomerCatalogsService(localStorageService, httpClientService);
  const accountStatementList = signal<CustomerAccountStatement[]>([]);
  const accountTypeList = signal<Array<CustomerAccountType>>([]);
  const bankList = signal<Array<CustomerBank>>([]);
  const currencyTypeList = signal<CustomerCurrencyType[]>([]);
  if ('customer-bank' === cat) {
    const bank = bankList().find((item: CustomerBank) => id == item.bankId);
    name = bank?.bankName ?? '';
  } else if ('currency' === cat) {
    const currency = currencyTypeList().find((item: CustomerCurrencyType) => id == item.currencyTypeId);
    name = currency?.description ?? '';
  } else if ('accountType' === cat) {
    const type = accountTypeList().find((item: CustomerAccountType) => id == item.bankAccountTypeId);
    name = type?.bankAccount ?? '';
  } else if ('accountStatus' === cat) {
    const type = accountStatementList().find((item: CustomerAccountStatement) => id == item.accountStatementId);
    name = type?.accountStatement ?? '';
  }
  return name;
}



