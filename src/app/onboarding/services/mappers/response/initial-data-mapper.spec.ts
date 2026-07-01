import {
  mapToSignalInitialData,
  mapToSignalInitialDataCustomer,
} from './initial-data-mapper';

describe('response/initial-data-mapper', () => {
  it('should map initial onboarding data preserving provided values', () => {
    const result = mapToSignalInitialData({
      curp: 'CURP',
      nif: null,
      tin: 'TIN',
      nss: undefined,
      rfc: 'RFC',
      firstName: 'John',
      middleName: 'A',
      firstLastName: 'Doe',
      secondLastName: 'Smith',
      dateOfBirth: '20/05/2026',
      gender: 'M',
      nationality: 'MX',
      countryOfBirth: 'MX',
      stateOfBirth: 'CDMX',
      cityOfBirth: null,
      ppe: true,
      foreignerWithoutCurp: false,
      bankAreaTypeId: 1,
      contraTypeId: 2,
      typeContractSubtypeId: 3,
    } as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        curp: 'CURP',
        nif: '',
        tin: 'TIN',
        nss: '',
        cityOfBirth: '',
        bankAreaTypeId: 1,
        contraTypeId: 2,
        typeContractSubtypeId: 3,
      }),
    );
  });

  it('should map customer initial data and default null input', () => {
    const mapped = mapToSignalInitialDataCustomer({
      curp: 'CURP',
      firstName: 'Jane',
      ppe: true,
      foreignerWithoutCurp: true,
    } as any);

    expect(mapped).toEqual(
      jasmine.objectContaining({
        curp: 'CURP',
        firstName: 'Jane',
        ppe: true,
        foreignerWithoutCurp: true,
      }),
    );

    expect(mapToSignalInitialDataCustomer(null)).toEqual(
      jasmine.objectContaining({
        curp: '',
        firstName: '',
        ppe: false,
        foreignerWithoutCurp: false,
      }),
    );
  });
});