import {
  bankAccountMapperQueryMaint,
  bankAccountMapperSaveCheckpoint,
  bankAccountMapperSaveMaint,
  mapBankAccounts,
} from './bank-account.mapper';

describe('bank-account.mapper', () => {
  it('should map checkpoint payload to bank account service format', () => {
    const input = [
      {
        accountType: '1',
        currency: 'MXN',
        domiciled: '1',
        accountStatus: '2',
        checkThird: true,
        checkDocument: false,
        checkPayment: true,
        maxAmount: '1000',
        bank: '001',
        alias: 'Cuenta principal',
        addresseeData: {
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          curp: 'CURP123456HDFABC01',
          rfc: 'XAXX010101000',
        },
        addresseeAccount: 1234567890,
        addresseeClabe: '123456789012345678',
        abaCode: 'ABA-1',
        swiftCode: 'SWIFT-1',
        reference: 'REF-1',
        concept: 'Pago',
        intermediaryBank: 'Banco Intermedio',
        subAccount: 'Titular',
        subAccountId: 'SUB-1',
      },
    ];

    const result = bankAccountMapperSaveCheckpoint(input as any);

    expect(result).toEqual([
      {
        accountType: '1',
        currency: 'MXN',
        domiciledIn: '1',
        accountStatus: '2',
        isThirdParty: true,
        paymentMethodDocument: false,
        paymentMethodElectronic: true,
        maxAmount: '1000',
        bank: '001',
        alias: 'Cuenta principal',
        beneficiaries: [
          {
            beneficiaryName: 'JUAN CARLOS PEREZ LOPEZ',
            curp: 'CURP123456HDFABC01',
            rfc: 'XAXX010101000',
            accountNumberIban: '1234567890',
            clabe: '123456789012345678',
            abaCode: 'ABA-1',
            swiftCode: 'SWIFT-1',
          },
        ],
        reference: 'REF-1',
        concept: 'Pago',
        intermediaryBank: 'Banco Intermedio',
        subaccountHolder: 'Titular',
        subaccountKey: 'SUB-1',
      },
    ]);
  });

  it('should map service response to section data for signal storage', () => {
    const result = mapBankAccounts({
      bankAccounts: [
        {
          accountType: '1',
          currency: 'MXN',
          domiciledIn: '1',
          accountStatus: '2',
          isThirdParty: true,
          paymentMethodDocument: false,
          paymentMethodElectronic: true,
          maxAmount: '1000',
          bank: '001',
          alias: 'Cuenta principal',
          beneficiaries: [
            {
              beneficiaryName: 'JUAN CARLOS PEREZ LOPEZ',
              accountNumberIban: '1234567890',
              clabe: '123456789012345678',
              abaCode: 'ABA-1',
              swiftCode: 'SWIFT-1',
            },
          ],
          reference: 'REF-1',
          concept: 'Pago',
          intermediaryBank: 'Banco Intermedio',
          subaccountHolder: 'Titular',
          subaccountKey: 'SUB-1',
        },
      ],
    } as any);

    expect(result).toHaveSize(1);
    expect(result[0]).toEqual(jasmine.objectContaining({
      accountType: '1',
      accountTypeName: '',
      accountStatus: '2',
      accountStatusName: '',
      currency: 'MXN',
      currencyName: '',
      domiciled: '1',
      maxAmount: '1000',
      bank: '001',
      bankName: '',
      alias: 'Cuenta principal',
      checkThird: true,
      checkDocument: false,
      checkPayment: true,
      addressee: 'JUAN CARLOS PEREZ LOPEZ',
      addresseeAccount: '1234567890',
      addresseeClabe: '123456789012345678',
      addresseeData: null,
      abaCode: 'ABA-1',
      swiftCode: 'SWIFT-1',
      reference: 'REF-1',
      concept: 'Pago',
      intermediaryBank: 'Banco Intermedio',
      subAccount: 'Titular',
      subAccountId: 'SUB-1',
      temporality: '',
      tempId: jasmine.any(String),
    }));
  });

  it('should map maintenance save payload using addressee data when not third party', () => {
    const result = bankAccountMapperSaveMaint([
      {
        bankAccountId: 7,
        active: true,
        accountType: '1',
        currency: 'MXN',
        domiciled: '1',
        accountStatus: '2',
        checkThird: false,
        checkDocument: true,
        checkPayment: false,
        maxAmount: '1500',
        bank: '001',
        alias: 'Cuenta mantenimiento',
        addresseeData: {
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          curp: 'CURP123456HDFABC01',
          rfc: 'XAXX010101000',
        },
        addresseeAccount: 9876543210,
        addresseeClabe: '123456789012345678',
        abaCode: 'ABA-2',
        swiftCode: 'SWIFT-2',
        reference: 'REF-2',
        concept: 'Cobro',
        intermediaryBank: 'Banco Intermedio 2',
        subAccount: 'Titular 2',
        subAccountId: 'SUB-2',
      },
    ] as any);

    expect(result).toEqual([
      {
        bankAccountId: 7,
        active: true,
        accountType: '1',
        currency: 'MXN',
        domiciledIn: '1',
        accountStatus: '2',
        isThirdParty: false,
        paymentMethodDocument: true,
        paymentMethodElectronic: false,
        maxAmount: '1500',
        bank: '001',
        alias: 'Cuenta mantenimiento',
        beneficiaries: [
          {
            beneficiaryName: 'JUAN CARLOS PEREZ LOPEZ',
            curp: 'CURP123456HDFABC01',
            rfc: 'XAXX010101000',
            accountNumberIban: '9876543210',
            clabe: '123456789012345678',
            abaCode: 'ABA-2',
            swiftCode: 'SWIFT-2',
          },
        ],
        reference: 'REF-2',
        concept: 'Cobro',
        intermediaryBank: 'Banco Intermedio 2',
        subaccountHolder: 'Titular 2',
        subaccountKey: 'SUB-2',
      },
    ]);
  });

  it('should map maintenance save payload using addressee text when third party', () => {
    const result = bankAccountMapperSaveMaint([
      {
        bankAccountId: null,
        active: false,
        accountType: '2',
        currency: 'USD',
        domiciled: '0',
        accountStatus: '1',
        checkThird: true,
        checkDocument: false,
        checkPayment: true,
        maxAmount: '2500',
        bank: '002',
        alias: 'Tercero',
        addressee: 'Proveedor SA',
        addresseeData: {
          firstName: 'IGNORED',
          middleName: 'IGNORED',
          firstLastName: 'IGNORED',
          secondLastName: 'IGNORED',
          curp: 'CURPIGNORED',
          rfc: 'RFCIGNORED',
        },
        addresseeAccount: 5555,
        addresseeClabe: 6666,
        abaCode: 'ABA-3',
        swiftCode: 'SWIFT-3',
        reference: 'REF-3',
        concept: 'Pago tercero',
        intermediaryBank: 'Banco Intermedio 3',
        subAccount: 'Titular 3',
        subAccountId: 'SUB-3',
      },
    ] as any);

    expect(result[0].bankAccountId).toBeNull();
    expect(result[0].active).toBeFalse();
    expect(result[0].beneficiaries[0]).toEqual(jasmine.objectContaining({
      beneficiaryName: 'Proveedor SA',
      curp: '',
      rfc: '',
      accountNumberIban: '5555',
      clabe: '6666',
      abaCode: 'ABA-3',
      swiftCode: 'SWIFT-3',
    }));
  });

  it('should map maintenance query payload to section data with defaults', () => {
    const result = bankAccountMapperQueryMaint([
      {
        bankAccountId: 9,
        active: true,
        accountStatus: '1',
        accountType: '2',
        currency: 'USD',
        domiciledIn: '1',
        maxAmount: null,
        bank: '003',
        alias: null,
        beneficiaries: [
          {
            beneficiaryName: 'Proveedor SA',
            accountNumberIban: '9999',
            clabe: '8888',
            abaCode: 'ABA-4',
            swiftCode: 'SWIFT-4',
          },
        ],
        paymentMethodDocument: null,
        paymentMethodElectronic: undefined,
        isThirdParty: undefined,
        concept: null,
        intermediaryBank: null,
        reference: null,
        subaccountHolder: null,
        subaccountKey: null,
        temporality: null,
      },
    ] as any);

    expect(result).toHaveSize(1);
    expect(result[0]).toEqual(jasmine.objectContaining({
      bankAccountId: 9,
      active: true,
      accountStatus: '1',
      accountStatusName: '',
      accountType: '2',
      accountTypeName: '',
      currency: 'USD',
      currencyName: '',
      domiciled: '1',
      maxAmount: '',
      bank: '003',
      bankName: '',
      alias: '',
      addressee: 'Proveedor SA',
      addresseeAccount: '9999',
      addresseeClabe: '8888',
      addresseeData: null,
      abaCode: 'ABA-4',
      swiftCode: 'SWIFT-4',
      checkDocument: false,
      checkPayment: false,
      checkThird: false,
      concept: '',
      intermediaryBank: '',
      reference: '',
      subAccount: '',
      subAccountId: '',
      temporality: '',
      tempId: jasmine.any(String),
    }));
  });
});