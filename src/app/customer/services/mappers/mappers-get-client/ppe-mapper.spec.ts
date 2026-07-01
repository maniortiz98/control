import { mapToSignalPPECustomer } from './ppe-mapper';

describe('response/ppe-mapper', () => {
  it('should map customer PPE data and defaults', () => {
    const result = mapToSignalPPECustomer({
      ppe: true,
      hasFamilyPpe: true,
      ppeType: 'TYPE',
      positionHeld: 'ROLE',
      expirationDate: '20/05/2026',
      familyData: [
        {
          tin: 'TIN1',
          dateOfBirth: '20/05/2026',
          stateOfBirth: '',
          cityOfBirth: 'MTY',
        },
      ],
    } as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        ppe: true,
        fppe: 'yes',
        dppe: 'no',
        sappe: 'no',
        expirationDate: '2026-05-20',
        dataClientDepPPE: [],
        dataClientSocAndAssoPPE: [],
      }),
    );
    expect(result.dataClientFamilyPPE[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '3',
        rfc: 'TIN1',
        stateOfBirth: 'MTY'
      }),
    );

    expect(mapToSignalPPECustomer(null)).toEqual(
      jasmine.objectContaining({
        ppe: false,
        fppe: 'no',
        dataClientFamilyPPE: [],
      }),
    );
  });
});
