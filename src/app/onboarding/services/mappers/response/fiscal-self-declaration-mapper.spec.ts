import { mapResToSignalFiscalSelfDeclaration } from './fiscal-self-declaration-mapper';

describe('response/fiscal-self-declaration-mapper', () => {
  it('should map fiscal self declaration data and nested residences', () => {
    const result = mapResToSignalFiscalSelfDeclaration({
      mexicoResident: true,
      curp: 'CURP',
      foreignerWithoutCurp: false,
      rfc: 'RFC123',
      name: 'John Doe',
      fiscalRegimeId: 601,
      cfdiUse: 'G01',
      taxPostalCode: '01000',
      nationality: 'MX',
      country: 'MX',
      fiscalResidenceAbroad: true,
      facta: true,
      crs: true,
      fiscalResidences: [
        {
          personType: '2',
          country: 'US',
          declarationFiscalResidence: '1',
          proofOfAddressType: 'XX03',
          issueDate: '2026-05-20',
          expirationStatus: 'vigente',
          expirationDate: '2027-05-20',
          certificationDate: '2026-05-21',
          declarationYear: 2026,
          aditionalDays: '30',
          factaObligations: {
            autentication: 'auth',
            nif: 'nif',
            tin: 'tin',
            nss: 'nss',
          },
        },
      ],
    } as any);

    expect(result.fiscalResidences[0]).toEqual(
      jasmine.objectContaining({
        personType: 'COTITULAR',
        declarationFiscalResidence: true,
        proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
        country: 'US',
        declarationYear: 2026,
        factaObligations: jasmine.objectContaining({
          autentication: 'auth',
          nif: 'nif',
          tin: 'tin',
          nss: 'nss',
        }),
      }),
    );
  });

  it('should apply defaults when values are missing', () => {
    const result = mapResToSignalFiscalSelfDeclaration({} as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        mexicoResident: false,
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        fiscalRegimeId: 0,
        fiscalResidences: [],
      }),
    );
  });
});