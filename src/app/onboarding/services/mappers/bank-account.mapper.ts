
import { concatFullName } from "../../../shared/utils/string";
import { BankAccount, BankAccountDataSection } from "../../models/bank-account";

/**
 * ONBOARDING Mapper
 * sends data to checkpoint
 */
export function bankAccountMapperSaveCheckpoint(data: any[]): BankAccount[] {
  console.log(data);
  return data.map((item: any) => {
    console.log(item);

    let benefName = concatFullName(
      item.addresseeData.firstName,
      item.addresseeData.middleName,
      item.addresseeData.firstLastName,
      item.addresseeData.secondLastName
    );

    return {
      accountType            : item.accountType,
      currency               : item.currency,
      domiciledIn            : item.domiciled,
      accountStatus          : item.accountStatus,
      isThirdParty           : item.checkThird,
      paymentMethodDocument  : item.checkDocument,
      paymentMethodElectronic: item.checkPayment,
      maxAmount              : item.maxAmount,
      bank                   : item.bank,
      alias                  : item.alias,
      beneficiaries: [
        {
            beneficiaryName  : benefName,
            curp             : item.addresseeData.curp,
            rfc              : item.addresseeData.rfc,
            accountNumberIban: item.addresseeAccount.toString() ?? '',
            clabe            : item.addresseeClabe.toString(),
            abaCode          : item.abaCode,
            swiftCode        : item.swiftCode,
        }
      ],
      reference       : item.reference,
      concept         : item.concept,
      intermediaryBank: item.intermediaryBank,
      subaccountHolder: item.subAccount,
      subaccountKey   : item.subAccountId,
    };
  });
}

/**
 * ONBOARDING Mapper
 * data from service to signal
 */
export function mapBankAccounts(bankAccounts: {bankAccounts: BankAccount[]}): BankAccountDataSection[] {

  console.log(bankAccounts);

  return bankAccounts.bankAccounts.map((bankAccount: any) => {

    const beneficiaries = bankAccount.beneficiaries ?? [];

    return {
      accountType      : bankAccount.accountType,
      accountTypeName  : '',
      accountStatus    : bankAccount.accountStatus,
      accountStatusName: '',
      currency         : bankAccount.currency,
      currencyName     : '',
      domiciled        : bankAccount.domiciledIn,
      maxAmount        : bankAccount.maxAmount,
      bank             : bankAccount.bank,
      bankName         : '',
      alias            : bankAccount.alias,
      checkThird       : bankAccount.isThirdParty ?? false,
      checkDocument    : bankAccount.paymentMethodDocument ?? false,
      checkPayment     : bankAccount.paymentMethodElectronic ?? false,
      addressee        : beneficiaries[0]?.beneficiaryName ?? '',
      addresseeAccount : beneficiaries[0]?.accountNumberIban ?? '',
      addresseeClabe   : beneficiaries[0]?.clabe ?? '',
      addresseeData    : null,
      abaCode          : beneficiaries[0]?.abaCode ?? '',
      swiftCode        : beneficiaries[0]?.swiftCode ?? '',
      reference        : bankAccount.reference,
      concept          : bankAccount.concept,
      intermediaryBank : bankAccount.intermediaryBank,
      subAccount       : bankAccount.subaccountHolder,
      subAccountId     : bankAccount.subaccountKey,
      temporality      : '',
      tempId           : crypto.randomUUID(),
    };
  });
}

/**
 * MAINTENANCE mapper.
 * Used to pass data to service.
 */
export function bankAccountMapperSaveMaint(data: any[]): BankAccount[] {
  console.log(data);

  return data.map((item: any) => {

    console.log(item);

    let benefName = item.checkThird ? item.addressee : concatFullName(
      item.addresseeData?.firstName ?? '',
      item.addresseeData?.middleName ?? '',
      item.addresseeData?.firstLastName ?? '',
      item.addresseeData?.secondLastName ?? ''
    );
    console.log(benefName);

    return {
      bankAccountId          : item.bankAccountId ?? null,
      active                 : item.active ?? null,
      accountType            : item.accountType,
      currency               : item.currency,
      domiciledIn            : item.domiciled,
      accountStatus          : item.accountStatus,
      isThirdParty           : item.checkThird,
      paymentMethodDocument  : item.checkDocument,
      paymentMethodElectronic: item.checkPayment,
      maxAmount              : item.maxAmount,
      bank                   : item.bank,
      alias                  : item.alias,
      beneficiaries: [
        {
            beneficiaryName  : benefName,
            curp             : item.checkThird ? '' : item.addresseeData?.curp ?? '',
            rfc              : item.checkThird ? '' : item.addresseeData?.rfc ?? '',
            accountNumberIban: item.addresseeAccount.toString() ?? '',
            clabe            : item.addresseeClabe.toString() ?? '',
            abaCode          : item.abaCode,
            swiftCode        : item.swiftCode,
        }
      ],
      reference       : item.reference,
      concept         : item.concept,
      intermediaryBank: item.intermediaryBank,
      subaccountHolder: item.subAccount,
      subaccountKey   : item.subAccountId,
    };
  });
}


/**
 * Mapper que recibe la info de la consulta en MANTENIMIENTO, y la manda al 'sginal'
 * para que pueda ser visualizado en la pantalla.
 */
export function bankAccountMapperQueryMaint(data: any): BankAccountDataSection[] {

  console.log(data);

  const dd = data.map((item: any) => {

    console.log(item);

    return {
      bankAccountId    : item.bankAccountId,
      active           : item.active,

      accountStatus    : item.accountStatus,
      accountStatusName: '',
      accountType      : item.accountType,
      accountTypeName  : '',

      currency        : item.currency,
      currencyName    : '',
      domiciled       : item.domiciledIn,
      maxAmount       : item.maxAmount ?? '',
      bank            : item.bank,
      bankName        : '',
      alias           : item.alias ?? '',

      addressee       : item.beneficiaries[0]?.beneficiaryName ?? '',
      addresseeAccount: item.beneficiaries[0]?.accountNumberIban ?? '',
      addresseeClabe  : item.beneficiaries[0]?.clabe ?? '',
      addresseeData   : null,
      abaCode         : item.beneficiaries[0]?.abaCode ?? '',
      swiftCode       : item.beneficiaries[0]?.swiftCode ?? '',

      checkDocument   : item.paymentMethodDocument ?? false,
      checkPayment    : item.paymentMethodElectronic ?? false,
      checkThird      : item.isThirdParty ?? false,

      concept         : item.concept ?? '',
      intermediaryBank: item.intermediaryBank ?? '',
      reference       : item.reference ?? '',
      subAccount      : item.subaccountHolder ?? '',
      subAccountId    : item.subaccountKey ?? '',
      temporality     : item.temporality ?? '',
      tempId          : crypto.randomUUID(),
    };

  });

  console.log(dd);
  return dd;
}
