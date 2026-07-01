export interface BankAccountCheckpoint {
    bankAccounts: BankAccount[]
}

export interface BankAccountForm {
  accountType     : string;
  currency        : string;
  domiciled       : string;
  accountStatus   : string;
  maxAmount       : string;
  bank            : string;
  alias           : string;
  checkThird      : boolean;
  checkDocument   : boolean;
  checkPayment    : boolean;
  addressee       : string;
  addresseeAccount: string;
  addresseeClabe  : string;
  reference       : string;
  concept         : string;
  intermediaryBank: string;
  subAccount      : string;
  subAccountId    : string;
  temporality     : string;
}

export interface BankAccount {
    bankAccountId?         : number | null;
    active?                : boolean | null;
    accountType            : string;
    currency               : string;
    domiciledIn            : string;
    accountStatus          : string;
    isThirdParty           : boolean;
    paymentMethodDocument  : boolean;
    paymentMethodElectronic: boolean;
    maxAmount              : string;
    bank                   : string;
    alias                  : string;
    beneficiaries          : BankAccountBenef[];
    reference              : string;
    concept                : string;
    intermediaryBank       : string;
    subaccountHolder       : string;
    subaccountKey          : string;
}

interface BankAccountBenef {
    beneficiaryName  : string;
    curp             : string;
    rfc              : string;
    accountNumberIban: string;
    clabe            : string;
    abaCode          : string;
    swiftCode        : string;
}

export interface BankAccountDataSection {
    bankAccountId   ?: number | null;
    active          ?: boolean;

    accountStatus    : string;
    accountStatusName: string;
    accountType      : string;
    accountTypeName  : string;

    currency         : string;
    currencyName     : string;
    domiciled        : string;
    maxAmount        : string;
    bank             : string;
    bankName         : string;
    alias            : string;

    checkDocument    : boolean;
    checkPayment     : boolean;
    checkThird       : boolean;

    addressee        : string;
    addresseeAccount : string;
    addresseeClabe   : string;
    addresseeData    : AddresseeData | null;
    abaCode          : string;
    swiftCode        : string;

    concept          : string;
    intermediaryBank : string;
    reference        : string;
    subAccount       : string;
    subAccountId     : string;
    temporality      : string;
    tempId           : string;
}

interface AddresseeData {
    birthDate     : string;
    countryOfBirth: string;
    curp          : string;
    firstLastName : string;
    firstName     : string;
    gender        : number;
    id            : string;
    middleName    : string;
    nif           : string;
    rfc           : string;
    secondLastName: string;
    ssn           : string;
}
