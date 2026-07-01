import { mapToSignalResourceProvider } from './resources-provider';

describe('response/resources-provider mapper', () => {
  it('should map resource provider data, ppe relatives and address', () => {
    const result = mapToSignalResourceProvider({
      generalData: {
        curp: 'CURP',
        foreignWithoutCURP: false,
        nss: 'SSN1',
        firstName: 'John',
        dateOfBirth: '20/05/2026',
        firstLastName: 'Doe',
        secondLastName: 'Smith',
        gender: '1',
        nationality: 'MX',
        countryOfBirth: 'MX',
        federalEntity: 'CDMX',
        relationship: 4,
        phone: 123456,
        email: 'demo@test.com',
      },
      personPpe: {
        isPpe: false,
        hasppeRelatives: true,
        ppeRelatives: [
          {
            rfc: 'RFC1',
            firstName: 'Jane',
            dateOfBirth: '2000-01-01',
            firstLastName: 'Doe',
            secondLastName: 'Smith',
            nationality: 'US',
            countryOfBirth: 'US',
            relationship: 8,
            positionHeld: 'REL',
          },
        ],
      },
      resourceProviderAddress: {
        addressType: 'OFFICE',
        country: 'MX',
        postalCode: 12345,
        federalEntity: 'CDMX',
        city: 'CDMX',
        municipality: 'BJ',
        neighborhood: 77,
        street: 'Street',
        externalNumber: 10,
        internalNumber: 11,
      },
    } as any);

    expect(result.generalData).toEqual(
      jasmine.objectContaining({
        typeIden: '4',
        rfc: 'SSN1',
        dateOfBirth: '2026-05-20',
        gender: 'M',
        relationship: '4',
        phone: '123456',
      }),
    );
    expect(result.ppe).toEqual(
      jasmine.objectContaining({
        ppe: false,
        fppe: true,
      }),
    );
    expect(result.ppe.dataFamily[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '1',
        rfc: 'RFC1',
        relationship: '8',
      }),
    );
    expect(result.adrres).toEqual(
      jasmine.objectContaining({
        addressType: 'OFFICE',
        postalCode: '12345',
        neighborhood: '77',
        externalNumber: '10',
        internalNumber: '11',
      }),
    );
  });

  it('should apply defaults when sections are missing', () => {
    const result = mapToSignalResourceProvider({} as any);

    expect(result.generalData).toEqual(
      jasmine.objectContaining({
        curp: '',
        typeIden: '',
        gender: '',
      }),
    );
    expect(result.ppe.dataFamily).toEqual([]);
    expect(result.adrres.country).toBe('');
  });
});