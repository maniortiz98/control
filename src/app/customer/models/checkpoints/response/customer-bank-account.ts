interface CustomerBankAccount {
    accountType: string | null;
    currency: string | null;
    domiciledIn: string | null;
    accountStatus: string | null;
    isThirdParty: boolean | null;
    paymentMethodDocument: boolean | null;
    paymentMethodElectronic: boolean | null;
    maxAmount: string | null;
    bank: string | null;
    alias: string | null;
    beneficiaries: Beneficiary[] | null;
    reference: string | null;
    concept: string | null;
    intermediaryBank: string | null;
    subaccountHolder: string | null;
    subaccountKey: string | null;
}

interface Beneficiary {
    beneficiaryName: string | null;
    curp: string | null;
    rfc: string | null;
    accountNumberIban: string | null;
    clabe: string | null;
}

export type CustomerBankAccounts = CustomerBankAccount[] | null;


export type BankAccounts = CustomerBankAccounts;

