export interface CustomerBankAccountCheckpoint {
    CustomerBankAccounts: CustomerBankAccount[]
}

export interface CustomerBankAccount {
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
}

export interface CustomerBankAccountDataSection {
    bankAccountId    ?: number | null;
    active           ?: boolean;
    accountStatus     : string;
    accountStatusName : string;
    accountType       : string;
    accountTypeName   : string;
    addressee1        : string;
    addressee1Account : string;
    addressee1Clabe   : string;
    addressee1Data    : AddresseeData | null;
    addressee2        : string;
    addressee2Account : string;
    addressee2Clabe   : string;
    addressee2Data    : AddresseeData | null;
    addressee3       ?: string;
    addressee3Account?: string;
    addressee3Clabe  ?: string;
    alias             : string;
    bank              : string;
    bankName          : string;
    checkDocument     : boolean;
    checkPayment      : boolean;
    checkThird        : boolean;
    concept           : string;
    currency          : string;
    currencyName      : string;
    domiciled         : string;
    intermediaryBank  : string;
    maxAmount         : string;
    reference         : string;
    subAccount        : string;
    subAccountId      : string;
    temporality       : string;
    tempId            : string;
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




export type BankAccountCheckpoint = CustomerBankAccountCheckpoint;
export type BankAccount = CustomerBankAccount;
export type BankAccountDataSection = CustomerBankAccountDataSection;

