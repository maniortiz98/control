import { mapToSignalRealOwner } from './real-owner-mapper';

describe('response/real-owner mapper', () => {
  it('should map real owner data, ppe relatives and address', () => {
    const result = mapToSignalRealOwner({
      generalData: {
        curp: 'CURP',
        foreignWithoutCURP: true,
        tin: 'TIN1',
        firstName: 'John',
        middleName: 'A',
        dateOfBirth: '20/05/2026',
        firstLastName: 'Doe',
        secondLastName: 'Smith',
        gender: '2',
        nationality: 'MX',
        countryOfBirth: 'MX',
        federalEntity: 'CDMX',
        relationship: 4,
        fiel: 'field-file',
        phone: 123456,
        email: 'demo@test.com',
        economicActivity: 'Services',
        fielExpirationDate: '2030-01-01',
      },
      personPpe: {
        isPpe: true,
        ppeType: 'TYPE',
        positionHeld: 'ROLE',
        positionEndDate: '2031-01-01',
        hasppeRelatives: true,
        ppeRelatives: [
          {
            nif: 'NIF1',
            firstName: 'Jane',
            middleName: 'B',
            dateOfBirth: '2000-01-01',
            firstLastName: 'Doe',
            secondLastName: 'Smith',
            nationality: 'US',
            countryOfBirth: 'US',
            positionEndDate: '2032-01-01',
            relationship: 6,
            positionHeld: 'REL',
          },
        ],
      },
      addressRealOwner: {
        addressType: 'HOME',
        other: 'OTHER',
        country: 'MX',
        postalCode: 12345,
        federalEntity: 'CDMX',
        city: 'CDMX',
        municipality: 'BJ',
        neighborhood: 99,
        street: 'Street',
        externalNumber: 10,
        internalNumber: 11,
      },
    } as any);

    expect(result.generalData).toEqual(
      jasmine.objectContaining({
        foreignerWithoutCurp: true,
        typeIden: '3',
        rfc: 'TIN1',
        dateOfBirth: '2026-05-20',
        gender: 'H',
        relationship: '4',
        phone: '123456',
        mail: 'demo@test.com',
        typePerson: '1',
      }),
    );
    expect(result.ppe).toEqual(
      jasmine.objectContaining({
        ppe: true,
        tppe: 'TYPE',
        fppe: true,
      }),
    );
    expect(result.ppe.dataFamily[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '2',
        rfc: 'NIF1',
        relationship: '6',
        dateOfBirth: '2000-01-01',
      }),
    );
    expect(result.adrres).toEqual(
      jasmine.objectContaining({
        postalCode: '12345',
        neighborhood: '99',
        externalNumber: '10',
        internalNumber: '11',
      }),
    );
  });

  it('should apply defaults when sections are missing', () => {
    const result = mapToSignalRealOwner({} as any);

    expect(result.generalData).toEqual(
      jasmine.objectContaining({
        curp: '',
        foreignerWithoutCurp: false,
        typeIden: '',
        rfc: '',
        gender: '',
      }),
    );
    expect(result.ppe.dataFamily).toEqual([]);
    expect(result.adrres.addressType).toBe('');
  });
});